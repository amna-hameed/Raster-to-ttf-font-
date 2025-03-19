import React, { useState } from "react";
import "../css/FAQ.css";

const faqs = [
    { question: "How does your AI-powered font identifier work?", answer: "Our model analyzes raster font images and predicts the closest vector fonts based on learned feature mappings." },
    { question: "What makes your font detection model unique?", answer: "Unlike traditional tools, our model uses deep learning to match raster fonts with vector fonts, providing high-accuracy results." },
    { question: "What types of font images does your model support?", answer: "Our model supports single-character and multi-character raster text images in fonts like Arial, Calibri, and Times New Roman." },
    { question: "How can I improve the accuracy of font identification?", answer: "Upload high-resolution, clear, and properly cropped text images with minimal noise for better predictions." },
    { question: "Does the model work on handwritten or cursive fonts?", answer: "Currently, our model focuses on printed raster fonts, but future updates may include support for handwritten and cursive fonts." },
    { question: "Is the font identification tool free to use?", answer: "Yes, you can use the basic font detection for free, while advanced features may be available in a premium version." },
  ];
  

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2>Most Frequently Asked Questions about FontFusion</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item" onClick={() => toggleFAQ(index)}>
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="faq-toggle">{openIndex === index ? "−" : "+"}</span>
            </div>
            {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
