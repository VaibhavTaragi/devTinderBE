const adminAuth = (req,res,next)=>{
    const token = 'abc';
    const isAuthenticated = token==='abc'
    if(!isAuthenticated){
        res.status(401).send('Unauthorized!')
    }else{
        next()
    }
}
const userAuth = (req,res,next)=>{
    const token = 'abc';
    const isAuthenticated = token==='abc'
    if(!isAuthenticated){
        res.status(401).send('Unauthorized!')
    }else{
        next()
    }
}

module.exports={ adminAuth, userAuth}