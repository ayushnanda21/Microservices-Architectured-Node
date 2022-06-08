//importing order model
const Order = require("../models/Order");
const OrderItem = require("../models/Order-Item");

//post order controller 
exports.orderCreate = async(req,res)=>{

    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
      let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product
      })
  
      newOrderItem = await newOrderItem.save();
  
      return newOrderItem._id;
  }))
  const orderItemsIdsResolved =  await orderItemsIds;
  
  //calculating total price
  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemsId)=>{
  
    const orderItem = await OrderItem.findById(orderItemsId).populate('product', 'price')
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice;
  
  }));
  
  //combining price of each orderItem and reducing to single
  const totalPrice = totalPrices.reduce((a,b)=> a+b, 0);
  
  
    const newOrder =  new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user
    });
  
    try{
        const savedOrder = await newOrder.save();
        if(!savedOrder){
            return res.status(400).json("Order can't be created");
        }
        res.status(201).json(savedOrder);
    } catch(err){
        res.status(500).json({
            error: err,
            success: false
        });
    }
  
}

//get all orders
exports.getallOrders = async (req,res)=>{

    try{
      const orderList = await Order.find().populate('user' ,'name');
      if(!orderList){
        res.status(400).json("Orders doesn't exist");
      } else{
        res.status(200).json({
          data: orderList,
          message: "Success",
          success: true
        });
      }
    } catch(err){
      res.statusMessage(500).json(err);
    }
  
}

//get order by id
exports.getorderId = async(req,res)=>{

    try{
      const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({path: 'orderItems', populate: 'product'});
  
      if(!order){
        res.status(404).json({
          message: "Order not found",
          success: false
        });
      } else{
        res.status(200).json({
          data: order,
          message: "Order found",
          success: true
        });
      }
    } catch(err){
      res.status(500).json(err);
    }
}

//update status of order
exports.updateOrder = async (req,res)=>{

    try{
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, 
        {
          $set: req.body,
        },
      {new : true}
      );
      if(!updatedOrder){
        res.status(400).json("Order not found");
    } else{
        res.status(200).json(updatedOrder);
    }
    } catch(err){
      res.status(500).json(err);
    }
}

//delete order
exports.deleteOrder = async (req,res)=>{

    try{
        const order = await Order.findById(req.params.id);
  
          if(order){
            await order.orderItems.map(async orderItem=>{
              await OrderItem.findByIdAndRemove(orderItem)
            })
            res.status(200).json({
              success: true,
              message: "Order has been deleted"
            });
          }
          else{
              res.status(404).json({
                success: false,
                message: "Order not deleted...err"
              });
          }         
    } catch(err){
        res.status(500).json(err);
    }
}

//get order sales
exports.getOrderSales = async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])
  
    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }
  
    res.send({totalsales: totalSales.pop().totalsales})
}

//get ordercount
exports.getOrderCount = async (req,res) =>{

    try{
        const orderCount  = await Order.countDocuments();
        if(!orderCount){
            res.status(400).json({
                success: false,
                message: "Count error!"
            });
        } else{
            res.status(200).json("Order count is : " + orderCount);
        }
    }catch(err){
        res.status(500).json({
            error: err,
            success: false
        })
    }
}

//getting our order in front end for user display
exports.getorderforUserDisplay = async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});
  
    if(!userOrderList) {
        res.status(404).json({success: false})
    } 
    res.status(200).json({
      data:userOrderList,
      success: true,
    });
}