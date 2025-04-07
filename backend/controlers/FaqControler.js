const { createFaqQuery, getAllFaqsQuery, getFaqByIdQuery, updateFaqQuery, deleteFaqQuery } = require('../queries');

exports.createFaq = async (req, res) => {
  const { question, answer } = req.body;

  try {
    const faqData = await createFaqQuery({ question, answer }); // Insère et retourne l’ID
    res.status(201).json({ message: 'FAQ créée avec succès', faq: faqData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la FAQ', error });
  }
};


exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await getAllFaqsQuery();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des FAQs', error });
  }
};

exports.getFaqById = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await getFaqByIdQuery(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ non trouvée' });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la FAQ', error });
  }
};

exports.updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  try {
    await updateFaqQuery(id, { question, answer });
    res.status(200).json({ message: 'FAQ mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la FAQ', error });
  }
};

exports.deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteFaqQuery(id);
    res.status(200).json({ message: 'FAQ supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la FAQ', error });
  }
};
