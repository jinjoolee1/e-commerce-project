const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint
router.get('/', (req, res) => {
  Tag.findAll({
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Product,
        as: 'product_tags',
        attributes: ['product_name', 'price'],
        include: [
          {
            model: Category,
            attributes: ['category_name']
          }
        ]
      }
    ]
  })
    .then(dbTagData => res.json(dbTagData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        as: 'product_tags',
        model: Product,
        attributes: ['product_name', 'price'],
        include: [
          {
            model: Category,
            attributes: ['category_name']
          }
        ]
      }
    ]
  })
    .then(dbTagData => {
      if(!dbTagData) {
        res.status(404).json({ message: "Could not find tag by this id." });
        return;
      }
      res.json(dbTagData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });

});

router.post('/', (req, res) => {
  Tag.create(req.body, {
    tag_name: req.body.tag_name
  })
    .then(dbTagData => res.json(dbTagData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    },
  })
    .then(dbTagData => {
      if(!dbTagData) {
        res.status(404).json({ message: "Could not find tag by this id." });
        return;
      }
      res.json(dbTagData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  },
  ProductTag.destroy({
    where: {
      product_id: req.params.id
    }
  })
  )
    .then(dbTagData => {
      if(!dbTagData) {
        res.status(404).json({ message: "Could not find tag by this id." });
        return;
      }
      res.json(dbTagData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;