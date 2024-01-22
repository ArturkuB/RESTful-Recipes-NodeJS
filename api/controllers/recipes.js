import mongoose from 'mongoose';
import Recipe from '../models/recipe.js';
import checkAuth from '../middleware/check-auth.js';
import path from 'path';

const recipes_get_all = async (req, res, next) => {
  try {
    const docs = await Recipe.find().exec();

    const response = {
      count: docs.length,
      recipes: docs.map((doc) => {
        return {
          _id: doc._id,
          author: doc.author,
          userId: doc.userId,
          name: doc.name,
          cookingTime: doc.cookingTime,
          servings: doc.servings,
          imageUrl: doc.imageUrl,
          ingredients: doc.ingredients,
          description: doc.description,
          instructions: doc.instructions,
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const recipes_create_recipe = async (req, res, next) => {
  try {
    console.log(req.body);
    const recipe = new Recipe({
      _id: new mongoose.Types.ObjectId(),
      author: req.body.author,
      name: req.body.name,
      cookingTime: req.body.cookingTime,
      userId: req.body.userId,
      imageUrl: req.body.imageUrl,
      servings: req.body.servings,
      ingredients: req.body.ingredients,
      description: req.body.description,
      instructions: req.body.instructions,
    });

    const savedRecipe = await recipe.save();

    res.status(201).json({
      message: 'Created recipe successfully',
      createdRecipe: {
        _id: savedRecipe._id,
        author: savedRecipe.author,
        name: savedRecipe.name,
        cookingTime: savedRecipe.cookingTime,
        userId: savedRecipe.userId,
        servings: savedRecipe.servings,
        ingredients: savedRecipe.ingredients,
        description: savedRecipe.description,
        instructions: savedRecipe.instructions,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  };
}


const recipes_get_recipe = async (req, res, next) => {
  try {
    const id = req.params.recipeId;
    const doc = await Recipe.findById(id)
    if (doc) {
      res.status(200).json({
        recipe: {
          _id: doc._id,
          author: doc.author,
          name: doc.name,
          cookingTime: doc.cookingTime,
          recipeUrl: doc.imageUrl,
          servings: doc.servings,
          ingredients: doc.ingredients,
          description: doc.description,
          instructions: doc.instructions,
        },
      });
    } else {
      res.status(404).json({ message: 'No valid entry found for provided ID' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};


const recipes_update_recipe = (req, res, next) => {
  const id = req.params.recipeId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Recipe.updateOne({ _id: id }, { $set: updateOps }) 
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Recipe updated',
        request: {
          type: 'GET',
          url: '.../recipes/' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

const recipes_delete = (req, res, next) => {
  const id = req.params.recipeId;
  Recipe.deleteOne({ _id: id }) 
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Recipe deleted',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

export default {
  recipes_get_all,
  recipes_create_recipe,
  recipes_get_recipe,
  recipes_update_recipe,
  recipes_delete,
};
