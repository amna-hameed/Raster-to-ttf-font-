import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';
import '../css/FontsPage.css';

const FontPreview = ({ fontName, sampleText, isRaster }) => {
  const daFontFonts = ['alagard'];
  const freeFonts = ['times-roman', 'arial-rounded-mt-regular'];

  const handleFontClick = () => {
    let searchUrl;
    if (isRaster) {
      searchUrl = `https://www.dafont.com/${fontName.toLowerCase()}.font`;
    } else {
      if (daFontFonts.includes(fontName.toLowerCase())) {
        searchUrl = `https://www.dafont.com/${fontName.toLowerCase()}.font`;
      } else if (freeFonts.includes(fontName.toLowerCase())) {
        searchUrl = `https://freefonts.co/fonts/${fontName.toLowerCase().replace(/\s+/g, '-')}`;
      } else {
        searchUrl = `https://fonts.google.com/specimen/${fontName.replace(/\s+/g, '+')}`;
      }
    }
    window.open(searchUrl, '_blank');
  };

  return (
    <div 
      className="font-preview" 
      style={{ fontFamily: fontName, fontSize: '20px', cursor: 'pointer', textAlign: 'center' }}
      onClick={handleFontClick}
    >
      {sampleText}
    </div>
  );
};

const FontsPage = () => {
  const [fonts, setFonts] = useState({ raster_fonts: [], vector_fonts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog');

  const fontPairs = [
    { raster: 'Alkhemikal', vector: 'Alagard' },
    { raster: 'DePixel', vector: 'Tiny5' },
    { raster: 'dogica', vector: 'VT323' },
    { raster: 'Minecraftia', vector: 'Press Start 2P' },
    { raster: 'Perfect-DOS-VGA-437', vector: 'Times-Roman' },
    { raster: 'Pixel-Arial-14', vector: 'Arial-rounded-mt-regular' },
    { raster: 'Retron2000', vector: 'VT323' },
    { raster: 'Upheaval', vector: 'Russo One' },
    { raster: 'Vhs-Gothic', vector: 'ShareTech Mono' },
    { raster: 'VCR-OSD-Mono', vector: 'JetBrains Mono' }
  ];

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_fonts');
        if (!response.ok) throw new Error('Failed to fetch fonts');
        const data = await response.json();
        console.log("Fetched Fonts:", data); // Debugging: See if fonts are properly fetched
        setFonts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFonts();
  }, []);

  if (loading) return <div className="loading-container">Loading fonts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fonts-page-container">
      <Navbar />
      <h2 className="title">Fonts Preview</h2>
      <label className="sample-label">Sample Text:</label>
      <input 
        type="text" 
        value={sampleText} 
        onChange={(e) => setSampleText(e.target.value)} 
        className="sample-input"
      />
      <div className="font-pairs-container">
        {fontPairs.map((pair, index) => {
          const rasterFont = fonts.raster_fonts.find(font => font.name.toLowerCase().trim() === pair.raster.toLowerCase().trim());
          const vectorFont = fonts.vector_fonts.find(font => font.name.toLowerCase().trim() === pair.vector.toLowerCase().trim());

          return (
            <div key={index} className="font-row">
              {/* Raster Font */}
              <div className="font-box">
                <div className="font-name">{pair.raster} (Raster)</div>
                <FontPreview fontName={rasterFont ? rasterFont.name : pair.raster} sampleText={sampleText} isRaster={true} />
              </div>
              
              {/* Vector Font */}
              <div className="font-box">
                <div className="font-name">{pair.vector} (Vector)</div>
                <FontPreview fontName={vectorFont ? vectorFont.name : pair.vector} sampleText={sampleText} isRaster={false} />
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default FontsPage;