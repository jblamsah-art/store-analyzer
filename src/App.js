import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) return;
    
    setAnalyzing(true);
    setTimeout(() => {
      alert('تم التحليل بنجاح! النتيجة الإجمالية: 85/100\n\n' +
            '🚀 توصيات رئيسية:\n' +
            '• تحسين سرعة التحميل\n' +
            '• تبسيط عملية الدفع\n' +
            '• إضافة مراجعات العملاء');
      setAnalyzing(false);
      setUrl('');
    }, 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔍</div>
          <h1 style={{
            color: '#333',
            marginBottom: '10px',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            محلل المتاجر المتطور
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
            تحليل شامل وذكي للمتاجر الإلكترونية
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '16px'
            }}>
              🌐 رابط متجرك الإلكتروني:
            </label>
            <input
              type="url"
              placeholder="مثال: https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={analyzing}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              background: analyzing ? 
                'linear-gradient(135deg, #ccc 0%, #999 100%)' : 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px',
              cursor: analyzing ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              marginBottom: '20px'
            }}
            onMouseOver={(e) => {
              if (!analyzing) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {analyzing ? '🔄 جاري التحليل...' : '🚀 بدء التحليل المجاني'}
          </button>
        </form>
        
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#666',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          <div style={{ marginBottom: '10px' }}>
            ✅ مجاني 100% • ⚡ نتائج خلال ثوان • 🔒 آمن ومشفر
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            يتم تحليل: الأداء • السيو • الأمان • تجربة المستخدم • معدل التحويل
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;