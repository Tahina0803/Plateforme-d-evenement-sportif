import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getAllFaqs } from '../../pages/services/faqService'; // Importer la fonction de récupération des FAQ
import './style/faqSection.css'; // Importez le fichier CSS

const FaqItem = ({ question, answer, isActive, onClick }) => {
  return (
    <div className={`faq-item ${isActive ? 'faq-active' : ''}`} onClick={onClick}>
      <h3>{question}</h3>
      <div className="faq-content">
        <p>{answer}</p>
      </div>
      <FontAwesomeIcon icon={faChevronRight} className="faq-toggle" />
    </div>
  );
};

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [faqs, setFaqs] = useState([]); // État pour stocker les FAQ récupérées
  const [error, setError] = useState(null); // État pour gérer les erreurs de récupération

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqData = await getAllFaqs(); // Récupérer les FAQ depuis l'API
        setFaqs(faqData); // Stocker les FAQ dans l'état
      } catch (error) {
        setError("Erreur lors de la récupération des FAQ");
        console.error(error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="faq section">
      <Container className="section-title" data-aos="fade-up">
        <h2>Questions fréquentes</h2>
      </Container>

      <Container>
        <Row className="justify-content-center">
          <Col lg={10} data-aos="fade-up" data-aos-delay="100">
            <div className="faq-container">
              {error ? (
                <p>{error}</p> // Afficher un message d'erreur si la récupération échoue
              ) : (
                faqs.map((faq, index) => (
                  <FaqItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isActive={index === activeIndex}
                    onClick={() => setActiveIndex(index === activeIndex ? null : index)}
                  />
                ))
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Faq;