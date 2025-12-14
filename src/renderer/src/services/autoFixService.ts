import axios from 'axios';

interface KirmaSerisiFixRequest {
  makineId: number;
  stokKodu: string;
  hataMesaji: string;
}

interface KirmaSerisiFixResult {
  success: boolean;
  message: string;
  makineId: number;
  stokKodu: string;
}

interface ErrorAnalysis {
  stokKodu: string | null;
  isKirmaSerisi: boolean;
  canAutoFix: boolean;
  errorType: 'KIRMA_SERISI' | 'OTHER';
  suggestion: string;
}

class AutoFixService {
  private readonly baseUrl = 'http://192.168.2.251:7777/api';

  /**
   * Kırma serisi hatalarını otomatik olarak düzeltir
   */
  async fixKirmaSerisi(request: KirmaSerisiFixRequest): Promise<{ success: boolean; data: KirmaSerisiFixResult; message: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/AutoFix/KirmaSerileri`, request);
      return response.data;
    } catch (error) {
      // Production'da hata logları
      console.error('AutoFix - Kırma serisi düzeltme hatası:', error);
      throw error;
    }
  }

  /**
   * UpdateKırmaSeritra prosedürünü çalıştırır
   */
  async executeUpdateKirmaSeritra(makineId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/AutoFix/UpdateKirmaSeritra/${makineId}`);
      return response.data;
    } catch (error) {
      // Production'da hata logları
      console.error('AutoFix - UpdateKırmaSeritra prosedürü hatası:', error);
      throw error;
    }
  }

  /**
   * Hata mesajından stok kodunu çıkarır
   */
  extractStokKodu(errorMessage: string): string | null {
    if (!errorMessage) return null;
    
    // "Hammadde Eksik - 150-60-001 - K2025080906504 - 0.21304751" formatından stok kodunu çıkar
    const regex = /Hammadde\s+Eksik\s*-\s*([0-9-]+)/i;
    const match = errorMessage.match(regex);
    
    return match ? match[1].trim() : null;
  }

  /**
   * Hata mesajının kırma serisi hatası olup olmadığını kontrol eder
   */
  isKirmaSerisiError(errorMessage: string): boolean {
    if (!errorMessage) return false;
    
    const stokKodu = this.extractStokKodu(errorMessage);
    return stokKodu === '150-60-001';
  }

  /**
   * Hata mesajını analiz eder ve otomatik düzeltme önerir
   */
  analyzeError(errorMessage: string, makineId: number): ErrorAnalysis {
    const stokKodu = this.extractStokKodu(errorMessage);
    const isKirmaSerisi = this.isKirmaSerisiError(errorMessage);
    
    return {
      stokKodu,
      isKirmaSerisi,
      canAutoFix: isKirmaSerisi && makineId > 0,
      errorType: isKirmaSerisi ? 'KIRMA_SERISI' : 'OTHER',
      suggestion: isKirmaSerisi 
        ? 'Bu kırma serisi hatası otomatik olarak düzeltilebilir.'
        : 'Bu hata türü için otomatik düzeltme mevcut değil.'
    };
  }

  /**
   * Otomatik düzeltme işlemini başlatır
   */
  async autoFix(errorMessage: string, makineId: number): Promise<{ success: boolean; data: KirmaSerisiFixResult; message: string }> {
    const analysis = this.analyzeError(errorMessage, makineId);
    
    if (!analysis.canAutoFix) {
      throw new Error(analysis.suggestion);
    }

    const request: KirmaSerisiFixRequest = {
      makineId,
      stokKodu: analysis.stokKodu!,
      hataMesaji: errorMessage
    };

    return await this.fixKirmaSerisi(request);
  }
}

export default new AutoFixService();
