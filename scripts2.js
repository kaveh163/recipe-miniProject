$(function() {
    $.ajax({
        type: "GET",
        url:"http://localhost:3000/home",
        success: function(data) {
            let HTML = "";
            $('#recipes').empty();
            data.forEach((item, index)=> {
                HTML += `<figure>
                <img src=${item.image} alt=${item.altName} style="width:250px;height:250px">
                <figcaption><h3>Fig.${item.id} - ${item.food}.</h3></figcaption>
              </figure>`;
              HTML += `<label style="font-family: Comic Sans MS, Comic Sans, cursive"> ingredients: </label>`
              HTML += '<ol style="margin-left: auto; margin-right: auto; width:50%; padding-left:140px">'
              item.ingredients.forEach((value, index)=> {
                
                  HTML +=`<li style="width:50px">${value}</li>`
                  
              })
              HTML += '</ol>'
              HTML += `<p style="font-family: Comic Sans MS, Comic Sans, cursive">instructions: ${item.instruction}</p>`
            })
            $('#recipes').append(HTML);
        },
        error: function(textStatus) {
            console.log(textStatus);
        } 

    })
})