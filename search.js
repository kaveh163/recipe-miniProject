$(function () {
    const ingStore = [];
    let count = 0;
    let inputHTML = `<input type="text" class="form-control inp" id="inp" placeholder = "Add Ingredient" name="inp" style="border: inset;">`;
    $('#icon').on('click', function () {
        let inputVal = $('.inp:last').val();
        // console.log(inputVal);
        if (inputVal) {
            if (ingStore.length === 0) {
                ingStore.push(inputVal.toLowerCase());
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
            }
        }
        // console.log('ingredients', ingStore);
        
    })
})