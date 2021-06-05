$(function () {
    let ingStore = [];
    let count = 0;
    let inputHTML = `<input type="text" class="form-control inp" id="inp" placeholder = "Add Ingredient" name="inp" style="border: inset;">`;
    $('#icon').on('click', function () {
        let inputVal = $('.inp:last').val();
        // console.log(inputVal);
        if (inputVal) {
            if (ingStore.length === 0) {
                ingStore.push(inputVal.toLowerCase());
                console.log('ing', ingStore);
                $('#addInp').append(inputHTML);
            } else {
                for (let i = 0; i < ingStore.length; i++) {
                    count++;
                    if (ingStore[i].toUpperCase() == inputVal.toUpperCase()) {
                        count = 0;
                        break;
                    } else {
                        if (count === ingStore.length) {
                            ingStore.push(inputVal.toLowerCase());
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
            if (ingStore.indexOf(inputVal2.toLowerCase()) === -1) {
                ingStore.push(inputVal2.toLowerCase());
                console.log('ingredients', ingStore);
                console.log(Array.isArray(ingStore));
                $.ajax({
                    method: "POST",
                    url: "http://localhost:3000/ingredients",
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
                    url: "http://localhost:3000/search",
                    success: function (data) {
                        let HTML = "";
                        $('#searchFood').empty();
                        data.forEach((item, index) => {
                            HTML += `<figure>
                            <img src=${item.image} alt=${item.altName} style="width:250px;height:250px">
                            <figcaption><h3>Fig.${item.id} - ${item.food}.</h3></figcaption>
                          </figure>`;
                            HTML += `<label style="font-family: Comic Sans MS, Comic Sans, cursive"> ingredients: </label>`
                            HTML += '<ol style="margin-left: auto; margin-right: auto; width:50%; padding-left:140px">'
                            item.ingredients.forEach((value, index) => {

                                HTML += `<li style="width:50px">${value}</li>`

                            })
                            HTML += '</ol>'
                            HTML += `<p style="font-family: Comic Sans MS, Comic Sans, cursive;text-align: center;">instructions:</p>`
                            HTML += `<p style="font-family: Comic Sans MS, Comic Sans, cursive; text-align: justify;">${item.instruction}</p>`
                            HTML += `<p><b style="font-family: Comic Sans MS, Comic Sans, cursive">Created by:</b> ${item.user}</p>`
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