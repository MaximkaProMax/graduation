const express = require('express');
const router = express.Router();
const Printing = require('../models/Printing');

// Маршрут для получения всех опций печати
router.get('/', async (req, res) => {
  try {
    const printingOptions = await Printing.findAll();
    // Преобразуем format и lamination обратно в массивы для фронта
    const result = printingOptions.map(option => ({
      ...option.dataValues,
      format: Array.isArray(option.format)
        ? option.format
        : (typeof option.format === 'string' && option.format.length > 0
            ? option.format.split(',').map(f => f.trim())
            : []),
      lamination: typeof option.lamination === 'string'
        ? [option.lamination]
        : (Array.isArray(option.lamination) ? option.lamination : []),
    }));
    console.log('Данные из базы данных:', result);
    res.json(result);
  } catch (error) {
    console.error('Ошибка при получении данных из базы данных:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Маршрут для добавления новой типографии
router.post('/', async (req, res) => {
  try {
    const {
      format,
      the_basis_of_the_spread,
      number_of_spreads,
      lamination,
      number_of_copies,
      address_delivery,
      final_price,
      album_name,
      main_card_photo,
      main_album_name,
      main_card_description
    } = req.body;

    // format должен быть массивом строк
    let formatArray = [];
    if (Array.isArray(format)) {
      formatArray = format.filter(f => typeof f === 'string' && f.trim() !== '');
    } else if (typeof format === 'string' && format.trim() !== '') {
      formatArray = [format.trim()];
    }

    // lamination — это строка, берём только первый элемент если пришёл массив
    let laminationValue = '';
    if (Array.isArray(lamination)) {
      laminationValue = lamination[0] || '';
    } else if (typeof lamination === 'string') {
      laminationValue = lamination;
    }

    const newTypography = await Printing.create({
      format: formatArray,
      basis_for_spread: the_basis_of_the_spread || 'Не указано',
      price_of_spread: number_of_spreads,
      lamination: laminationValue,
      copy_price: number_of_copies,
      address_delivery: address_delivery || 'Не указано',
      final_price,
      album_name,
      main_card_photo,
      main_album_name,
      main_card_description
    });

    console.log('Добавлена новая типография:', newTypography);
    res.status(201).json(newTypography);
  } catch (error) {
    console.error('Ошибка при добавлении типографии:', error.message, error);
    res.status(500).json({ error: 'Ошибка при добавлении типографии' });
  }
});

// Обновление данных типографии
router.put('/:id', async (req, res) => {
  try {
    const typographyId = req.params.id;
    const updatedData = { ...req.body };

    // Преобразуем format и lamination в массивы для Postgres ARRAY
    if (typeof updatedData.format === 'string') {
      updatedData.format = updatedData.format.split(',').map(f => f.trim()).filter(Boolean);
    }
    if (Array.isArray(updatedData.format)) {
      updatedData.format = updatedData.format.filter(f => typeof f === 'string' && f.trim() !== '');
    }

    // lamination — всегда строка (в БД), берем первый элемент если массив
    if (Array.isArray(updatedData.lamination)) {
      updatedData.lamination = updatedData.lamination[0] || '';
    }

    // Удаляем лишние поля, которые не существуют в модели
    delete updatedData.id;

    // Лог для отладки
    console.log('Данные для обновления типографии:', updatedData);

    const [updated] = await Printing.update(updatedData, { where: { id: typographyId } });
    if (updated) {
      const updatedTypography = await Printing.findByPk(typographyId);
      res.status(200).json(updatedTypography);
    } else {
      res.status(404).json({ success: false, message: 'Типография не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении данных типографии:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении данных типографии', details: error.message });
  }
});

// Маршрут для удаления типографии
router.delete('/:id', async (req, res) => {
  try {
    const typographyId = req.params.id;
    const deleted = await Printing.destroy({ where: { id: typographyId } });
    if (deleted) {
      res.status(200).json({ success: true, message: 'Типография успешно удалена' });
    } else {
      res.status(404).json({ success: false, message: 'Типография не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при удалении типографии:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении типографии' });
  }
});

module.exports = router;