import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';
import { UserService } from './userService.js';
import { AppError } from '../middleware/errorHandler.js';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: Date;
}

export interface EmergencyEmailData {
  recipientEmail: string;
  recipientName: string;
  motherName: string;
  customMessage?: string;
  location?: LocationData;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_PORT === 465, 
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
  });

  static async sendEmergencyNotification(
    userId: number, 
    customMessage?: string, 
    location?: LocationData
  ): Promise<void> {
    const userProfile = await UserService.getUserProfile(userId);
    
    const connections = await UserService.getUserConnections(userId);

    if (connections.length === 0) {
      throw new AppError('No emergency contacts found', 400);
    }

    const motherName = userProfile.fullName || userProfile.email;

    const emailPromises = connections.map(connection => 
      this.sendEmergencyEmail({
        recipientEmail: connection.connectionEmail,
        recipientName: connection.connectionName,
        motherName,
        customMessage,
        location,
      })
    );

    try {
      await Promise.all(emailPromises);
    } catch (error) {
      console.error('Error sending emergency emails:', error);
      throw new AppError('Failed to send emergency notifications', 500);
    }
  }

  private static generateGoogleMapsLink(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  private static formatLocationText(location: LocationData): string {
    const coords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    if (location.address) {
      return `${location.address}\nKoordinat: ${coords}`;
    }
    return `Koordinat: ${coords}`;
  }

  static async sendEmergencyEmail(emailData: EmergencyEmailData): Promise<void> {
    const { recipientEmail, recipientName, motherName, customMessage, location } = emailData;

    const subject = '🚨 PEMBERITAHUAN DARURAT - PantauSiKecil';
    
    const locationHtmlSection = location ? `
      <div style="background-color: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #1976d2;">📍 Lokasi Terakhir Diketahui:</h4>
        <p style="margin: 5px 0; color: #1976d2;">
          ${location.address ? `<strong>Alamat:</strong> ${location.address}<br>` : ''}
          <strong>Koordinat:</strong> ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
        </p>
        <div style="margin-top: 15px;">
          <a href="${this.generateGoogleMapsLink(location.latitude, location.longitude)}" 
             style="background-color: #4CAF50; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; margin-right: 10px; font-size: 14px;">
            Buka di Google Maps
          </a>
        </div>
        ${location.timestamp ? `
          <p style="font-size: 12px; color: #666; margin-top: 10px; margin-bottom: 0;">
            Lokasi terakhir diperbarui: ${location.timestamp.toLocaleString('id-ID', { 
              timeZone: 'Asia/Jakarta',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} WIB
          </p>
        ` : ''}
      </div>
    ` : `
      <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #856404;">
          ⚠️ Lokasi tidak tersedia - pastikan untuk segera menghubungi ${motherName}
        </p>
      </div>
    `;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ff4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🚨 PEMBERITAHUAN DARURAT</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Halo ${recipientName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Kami mengirimkan pesan darurat ini atas nama <strong>${motherName}</strong> yang menggunakan aplikasi PantauSiKecil.
          </p>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #856404;">
              ⚠️ ${motherName} mungkin sedang dalam keadaan darurat dan membutuhkan bantuan segera.
            </p>
          </div>

          ${locationHtmlSection}
          
          ${customMessage ? `
            <div style="background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #007bff;">Pesan Tambahan:</h4>
              <p style="margin-bottom: 0; font-style: italic;">"${customMessage}"</p>
            </div>
          ` : ''}
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #155724;">Yang Perlu Anda Lakukan:</h4>
            <ul style="color: #155724; margin-bottom: 0;">
              <li>Segera hubungi ${motherName} melalui telepon atau pesan</li>
              ${location ? '<li>Gunakan informasi lokasi di atas untuk menemukan keberadaannya</li>' : ''}
              <li>Jika tidak dapat dihubungi, pertimbangkan untuk datang langsung</li>
              <li>Jika diperlukan, hubungi layanan darurat (119/112)</li>
              <li>Pastikan kondisi kehamilan dan kesehatannya</li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            Pesan ini dikirim secara otomatis oleh sistem PantauSiKecil pada ${new Date().toLocaleString('id-ID', { 
              timeZone: 'Asia/Jakarta',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} WIB.
          </p>
          
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            PantauSiKecil - Aplikasi Pemantauan Ibu Hamil<br>
            Jika Anda menerima pesan ini dengan keliru, mohon diabaikan.
          </p>
        </div>
      </div>
    `;

    // Generate location section for text email
    const locationTextSection = location ? `
Lokasi terakhir diketahui:
${this.formatLocationText(location)}

Link Google Maps: ${this.generateGoogleMapsLink(location.latitude, location.longitude)}

${location.timestamp ? `Lokasi terakhir diperbarui: ${location.timestamp.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB` : ''}
` : `⚠️ Lokasi tidak tersedia - pastikan untuk segera menghubungi ${motherName}`;

    const textBody = `
PEMBERITAHUAN DARURAT - PantauSiKecil

Halo ${recipientName},

Kami mengirimkan pesan darurat ini atas nama ${motherName} yang menggunakan aplikasi PantauSiKecil.

⚠️ ${motherName} mungkin sedang dalam keadaan darurat dan membutuhkan bantuan segera.

${locationTextSection}

${customMessage ? `Pesan tambahan: "${customMessage}"` : ''}

Yang perlu Anda lakukan:
- Segera hubungi ${motherName} melalui telepon atau pesan
${location ? '- Gunakan informasi lokasi di atas untuk menemukan keberadaannya' : ''}
- Jika tidak dapat dihubungi, pertimbangkan untuk datang langsung
- Jika diperlukan, hubungi layanan darurat (119/112)
- Pastikan kondisi kehamilan dan kesehatannya

Pesan ini dikirim secara otomatis oleh sistem PantauSiKecil pada ${new Date().toLocaleString('id-ID', { 
  timeZone: 'Asia/Jakarta'
})} WIB.

PantauSiKecil - Aplikasi Pemantauan Ibu Hamil
    `;

    const mailOptions = {
      from: `"PantauSiKecil Emergency" <${ENV.EMAIL_FROM}>`,
      to: recipientEmail,
      subject,
      text: textBody,
      html: htmlBody,
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async testEmailConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email configuration test failed:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(userEmail: string, userName?: string): Promise<void> {
    const subject = 'Selamat Datang di PantauSiKecil! 🤱';
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Selamat Datang di PantauSiKecil! 🤱</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
          <h2>Halo ${userName || 'Ibu'}!</h2>
          
          <p>Terima kasih telah bergabung dengan PantauSiKecil - aplikasi yang akan membantu Anda memantau kesehatan kehamilan dengan lebih baik.</p>
          
          <h3>Fitur yang bisa Anda gunakan:</h3>
          <ul>
            <li>📊 Pantau nutrisi harian</li>
            <li>💧 Tracking konsumsi air</li>
            <li>🏃‍♀️ Monitor aktivitas fisik</li>
            <li>⏰ Pengingat penting</li>
            <li>👥 Koneksi dengan keluarga</li>
            <li>🆘 Notifikasi darurat dengan lokasi</li>
          </ul>
          
          <p>Jangan lupa untuk melengkapi profil dan data kehamilan Anda untuk mendapatkan pengalaman yang optimal!</p>
          
          <p style="margin-top: 30px;">
            Salam hangat,<br>
            Tim PantauSiKecil
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"PantauSiKecil" <${ENV.EMAIL_FROM}>`,
      to: userEmail,
      subject,
      html: htmlBody,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }
}