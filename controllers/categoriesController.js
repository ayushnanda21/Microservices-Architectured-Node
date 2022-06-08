const Category = require("../models/Category");

//add category
exports.createCategory = async(req,res)=>{

    const newCategory =  new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    try{
        const savedCategory = await newCategory.save();
        if(!savedCategory){
            return res.status(403).json("Category can't be created");
        }
        res.status(201).json(savedCategory);
    } catch(err){
        res.status(500).json({
            error: err,
            success: false
        });
    }

}

exports.updateCategory = async (req,res)=>{

    try{
    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        {new: true}
        );
    
        if(!updatedCategory){
            res.status(400).json({
                status: false,
                message: "Category doesnt exist"
            });
        } else{
            res.status(200).json({
                data : updatedCategory,
                success: true,
                message: "Successfully updated"
            })

        }
    } catch(err){
        res.status(500).json(err);
    }
}

exports.deleteCategory = async (req,res)=>{

    try{
        const deletedCategory = await Category.findById(req.params.id);
        if(!deletedCategory){
            res.status(404).json({
                success: false,
                message : "Category doesn't exist"
            });
        } else{
            await deletedCategory.deleteOne();
            res.status(200).json({
                success: true,
                message : "Category successfully deleted"
            });
        }
           
    } catch(err){
        res.status(500).json(err);
    }

}

exports.getallCategories = async(req,res)=>{

    const categoryList = await Category.find();
    try{
        if(categoryList.length === 0){
            res.status(404).json({
                success: false,
                message : "Categories Empty"
            });
        } else{
            res.status(200).json({
                data : categoryList,
                message: "success"
            });
        }  
    } catch(err){
        res.status(500).json(err);
    }

}

exports.getCategoryById = async (req,res)=>{

    try{
        const item = await Category.findById(req.params.id);
        if(!item){
            res.status(404).json({
                success: false,
                message : "Item you requested doesn't exist"
            });
        } else{
            res.status(200).json(item);
        }
    } catch(err){
        res.status(500).json(err);
    }



}