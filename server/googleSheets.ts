import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import type { Shipment, InsertShipment } from '@shared/schema';

export class GoogleSheetsService {
  private sheets: any;
  private auth: JWT;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '';
    
    // Initialize Google Auth with service account
    this.auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async initialize() {
    try {
      await this.auth.authorize();
      console.log('Google Sheets API authorized successfully');
      
      // Create header row if spreadsheet is empty
      await this.setupSheetHeaders();
    } catch (error) {
      console.error('Failed to authorize Google Sheets API:', error);
      throw error;
    }
  }

  private async setupSheetHeaders() {
    const headers = [
      'ID', 'Date', 'Consignment Number', 'Truck Number', 'Consignee', 
      'Consignee Location', 'Weight', 'Rate', 'Delivery Charge', 'Freight',
      'Consignor Location', 'Number of Articles', 'Nature of Goods', 
      'Consignor', 'Notes', 'Last Updated'
    ];

    try {
      // Check if headers already exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A1:P1',
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: 'Sheet1!A1:P1',
          valueInputOption: 'RAW',
          resource: {
            values: [headers],
          },
        });
        console.log('Sheet headers created');
      }
    } catch (error) {
      console.error('Error setting up sheet headers:', error);
    }
  }

  async syncShipmentToSheet(shipment: Shipment): Promise<void> {
    try {
      const values = [
        shipment.id,
        new Date(shipment.date).toLocaleDateString(),
        shipment.consignmentNumber,
        shipment.truckNumber,
        shipment.consignee,
        shipment.consigneeLocation,
        shipment.weight,
        shipment.rate,
        shipment.deliveryCharge,
        shipment.freight,
        shipment.consignorLocation,
        shipment.numberOfArticles,
        shipment.natureOfGoods,
        shipment.consignor,
        shipment.notes || '',
        new Date().toISOString()
      ];

      // Check if shipment already exists in sheet
      const existingRowIndex = await this.findShipmentRow(shipment.id);

      if (existingRowIndex > 0) {
        // Update existing row
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `Sheet1!A${existingRowIndex}:P${existingRowIndex}`,
          valueInputOption: 'RAW',
          resource: {
            values: [values],
          },
        });
      } else {
        // Append new row
        await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: 'Sheet1!A:P',
          valueInputOption: 'RAW',
          resource: {
            values: [values],
          },
        });
      }
    } catch (error) {
      console.error('Error syncing shipment to sheet:', error);
      throw error;
    }
  }

  async getShipmentsFromSheet(): Promise<Partial<InsertShipment>[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A2:P', // Skip header row
      });

      if (!response.data.values) {
        return [];
      }

      return response.data.values.map((row: any[]) => ({
        date: new Date(row[1] || Date.now()),
        consignmentNumber: row[2] || '',
        truckNumber: row[3] || '',
        consignee: row[4] || '',
        consigneeLocation: row[5] || '',
        weight: parseFloat(row[6]) || 0,
        rate: row[7] || '0',
        deliveryCharge: parseFloat(row[8]) || 0,
        freight: parseFloat(row[9]) || 0,
        consignorLocation: row[10] || '',
        numberOfArticles: row[11] || 'Loose',
        natureOfGoods: row[12] || '',
        consignor: row[13] || '',
        notes: row[14] || '',
      }));
    } catch (error) {
      console.error('Error getting shipments from sheet:', error);
      throw error;
    }
  }

  async deleteShipmentFromSheet(shipmentId: number): Promise<void> {
    try {
      const rowIndex = await this.findShipmentRow(shipmentId);
      if (rowIndex > 0) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 0,
                    dimension: 'ROWS',
                    startIndex: rowIndex - 1,
                    endIndex: rowIndex,
                  },
                },
              },
            ],
          },
        });
      }
    } catch (error) {
      console.error('Error deleting shipment from sheet:', error);
      throw error;
    }
  }

  private async findShipmentRow(shipmentId: number): Promise<number> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:A',
      });

      if (!response.data.values) {
        return -1;
      }

      for (let i = 1; i < response.data.values.length; i++) {
        if (response.data.values[i][0] == shipmentId) {
          return i + 1; // Row numbers are 1-indexed
        }
      }

      return -1;
    } catch (error) {
      console.error('Error finding shipment row:', error);
      return -1;
    }
  }

  async syncAllShipmentsToSheet(shipments: Shipment[]): Promise<void> {
    try {
      // Clear existing data (except headers)
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A2:P',
      });

      // Prepare all shipment data
      const values = shipments.map(shipment => [
        shipment.id,
        new Date(shipment.date).toLocaleDateString(),
        shipment.consignmentNumber,
        shipment.truckNumber,
        shipment.consignee,
        shipment.consigneeLocation,
        shipment.weight,
        shipment.rate,
        shipment.deliveryCharge,
        shipment.freight,
        shipment.consignorLocation,
        shipment.numberOfArticles,
        shipment.natureOfGoods,
        shipment.consignor,
        shipment.notes || '',
        new Date().toISOString()
      ]);

      // Batch update all data
      if (values.length > 0) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: 'Sheet1!A2:P',
          valueInputOption: 'RAW',
          resource: {
            values: values,
          },
        });
      }
    } catch (error) {
      console.error('Error syncing all shipments to sheet:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();