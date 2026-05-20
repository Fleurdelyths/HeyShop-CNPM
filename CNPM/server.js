const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// phục vụ file tĩnh html css js
app.use(express.static(__dirname));

// API test
app.get('/api/health', (req,res)=>{
    res.json({
        status:'ok',
        service:'HeyShop Backend'
    });
});

// API sản phẩm
app.get('/api/products',(req,res)=>{
    res.json({
        products:[
            {id:1,name:'Sample Product 1',price:199000},
            {id:2,name:'Sample Product 2',price:299000}
        ]
    });
});

// login
app.post('/api/login',(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({
            error:'Email and password required'
        });
    }

    res.json({
        success:true,
        user:{email}
    });
});

// register
app.post('/api/register',(req,res)=>{
    const {fullname,email,password}=req.body;

    if(!fullname || !email || !password){
        return res.status(400).json({
            error:'Missing data'
        });
    }

    res.json({
        success:true
    });
});

app.listen(PORT,()=>{
    console.log(`HeyShop backend is running on http://localhost:${PORT}`);
});
