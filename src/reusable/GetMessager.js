const  getOrganizeMessager =function (origen,callback){
      let mensaje="";
     
      if(origen!== undefined){  
        console.log(origen);   

        console.log(Array.isArray(origen)); 
        if (Array.isArray(origen)){
            if(Array.isArray(origen.data.message)  )
            {
                origen.data.message.forEach((element) => {
                mensaje+="\n *"+element;
                });
            }else
            {
                mensaje=origen.data.message;
            }
        }else{
            console.log(origen.message);
            if(Array.isArray(origen.message))
            {
                origen.message.forEach((element) => {
                    mensaje+="\n *"+element;
                    });
            }else{
                if(Array.isArray(origen.message) )
                {
                    console.log("array");
                    origen.data.message.forEach((element) => {
                    mensaje+="\n *"+element;
                    });
                }else
                {
                    mensaje=origen.data.message;
                }
            }
           
        }
        }

        callback(mensaje);
    }
    export default getOrganizeMessager