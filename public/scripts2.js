// for index.html
$(function() {
    $.ajax({
        type: "GET",
        url:"/home",
        success: function(data) {
            let HTML = "";
            $('#recipes').empty();
            data.forEach((item, index)=> {
                HTML += `<figure>
                <img src= ${item.image} alt=${item.altName} style="width:100%;height:250px">
                <figcaption><h3>Fig.${item.id} - ${item.food}.</h3></figcaption>
              </figure>`;
              HTML += '<div class="d-flex justify-content-center">'
              HTML += '<div class="text-center">'
              HTML += `<label style="font-family: Comic Sans MS, Comic Sans, cursive" class="d-block"> ingredients: </label>`
              HTML += '<ol>'
              item.ingredients.forEach((value, index)=> {
                
                  HTML +=`<li>${value}</li>`
                  
              })
              HTML += '</ol>'
              HTML += `<p style="font-family: Comic Sans MS, Comic Sans, cursive;text-align: center;">instructions:</p>`
              HTML += `<p style="font-family: Comic Sans MS, Comic Sans, cursive;text-align:justify;text-align-last: center;">${item.instruction}</p>`
              HTML += `<p><b style="font-family: Comic Sans MS, Comic Sans, cursive">Created by:</b> ${item.user}</p>`
              HTML += '</div>'
              HTML += '</div>'
            })
            $('#recipes').append(HTML);
        },
        error: function(textStatus) {
            console.log(textStatus);
        } 

    })
})