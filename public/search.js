$(function () {
    let ingStore = [];
    let count = 0;
    let inputHTML = `<input type="text" class="form-control inp" id="inp" placeholder = "Add Ingredient" name="inp" style="border: inset;">`;
    $('#icon').on('click', function () {
        let inputVal = $('.inp:last').val();
        // console.log(inputVal);
        if (inputVal) {
            if (ingStore.length === 0) {
                ingStore.push(inputVal);
                console.log('ing', ingStore);
                $('#addInp').append(inputHTML);
            } else {
                for (let i = 0; i < ingStore.length; i++) {
                    count++;
                    if (ingStore[i] == inputVal) {
                        count = 0;
                        break;
                    } else {
                        if (count === ingStore.length) {
                            ingStore.push(inputVal);
                            $('#addInp').append(inputHTML);
                        }
                    }
                }
                // if (ingStore.indexOf(inputVal) === -1) {
                //     ingStore.push(inputVal);
                // }
            }
        }

        // console.log(ingStore);

        // let inputHTML = `<input type="text" class="form-control inp" id="inp" placeholder = "Add Ingredient" name="inp" style="border: inset;">`;
        // $('#addInp').append(inputHTML);

    })
    $('#frm-btn').on('click', function (event) {
        event.preventDefault();
        let inputVal2 = $('.inp:last').val();
        if (inputVal2) {
            if (ingStore.indexOf(inputVal2) === -1) {
                ingStore.push(inputVal2);
                console.log('ingredients', ingStore);
                console.log(Array.isArray(ingStore));
                $.ajax({
                    method: "POST",
                    url: "/ingredients",
                    data: {
                        'ingred': ingStore
                    },
                    success: function (data) {
                        console.log('success');
                    }
                })
                ingStore = [];
                $('#addInp').empty();
                $('#inp').val('');
                $.ajax({
                    type: "GET",
                    url: "/search",
                    success: function (data) {
                        let HTML = "";
                        $('#searchFood').empty();
                        data.forEach((item, index) => {
                            HTML += `<figure>
                <img src= ${item.image} alt=${item.altName} style="width:100%;height:250px;object-fit: cover">
                <figcaption><h3 class="fontRes" style="font-family: 'Times New Roman', serif;"><span>${item.food}</span></h3></figcaption>
              </figure>`;
            //   HTML += '<div class="d-flex justify-content-center">'
              HTML += '<div class="text-left">'
              HTML += `<label style="font-family: Comic Sans MS, Comic Sans, cursive" class="d-block"> 
              <span class="bg-danger text-white" style="border: 1px solid black; border-radius:25px; padding: 10px;">ingredients </span></label>`
            //   card deck section
             HTML += '<div class="card-deck mt-3">'
              item.ingredients.forEach((value, index)=> {
                  HTML += '<div class="d-flex justify-content-start">'
                // HTML += '<div class="card-deck">'
                HTML += '<div class="card bg-primary" style="border-radius:50%">'
                HTML += '<div class="card-body text-center text-white">'
                
                  HTML +=`<p class="card-text">${value}</p>`
                  HTML += '</div>'
                  HTML += '</div>'
                //   HTML += '</div>'
                  HTML+= '</div>'
                  
              })
              HTML+= '</div>'
             HTML += '<hr>'
            //   end of card deck section
              HTML += `<p class="mt-4"style="font-family: Comic Sans MS, Comic Sans, cursive;text-align: left;"><span class="bg-info text-white" style="border: 1px solid black; border-radius:25px; padding: 10px;">instructions</span></p>`
              HTML += `<textarea disabled class="form-control" style="font-family: Comic Sans MS, Comic Sans, cursive;text-align:justify;text-align-last: left;overflow: auto"rows="5">${item.instruction}</textarea>`
              HTML += `<p class="mt-5"><b style="font-family: Comic Sans MS, Comic Sans, cursive">Created by:</b> ${item.user}</p>`
              HTML += '</div>'
            //   HTML += '</div>'
                        })
                        $('#searchFood').append(HTML);
                    },
                    error: function (textStatus) {
                        console.log(textStatus);
                    }

                })

            }
        }
        // console.log('ingredients', ingStore);

    })
})