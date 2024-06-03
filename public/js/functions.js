    (function () {
      'use strict'
        console.log("funcion cargada")
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.querySelectorAll('.needs-validation')
      console.log('---------------------')
      console.log(forms)
      // Loop over them and prevent submission
      Array.prototype.slice.call(forms)
        .forEach(function (form) {
          form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
            }
    
            form.classList.add('was-validated')
          }, false)
        })
    })();


    function validateForm2(obj,id){
      let form = obj
      let modal = document.getElementById('editUser_'+id)
      let p1 = document.getElementById('password_'+id);
      let p2 = document.getElementById('password2_'+id);
      var confirm = document.getElementById('p_'+id);
      console.log('validate this form')
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
          form.classList.add('was-validated')
          modal.classList.add('was-validated')
        }else if (p1.value != p2.value){
            confirm.innerHTML = "Las claves no coinciden";
            p2.classList.remove('is-valid');
            p2.classList.add('is-invalid');
            p2.style.borderColor = "red"
            modal.classList.add('was-validated')
            event.preventDefault();
          }else{
              console.log('pass match')
              p2.classList.remove('is-ivalid');
              p2.classList.add('is-valid');
              p2.style.borderColor = "green"
              confirm.innerHTML = "";
        }
    };

    function validateForm3(obj,id){
        let form = obj
        let modal = document.getElementById(id)
        console.log('validate this form')
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            form.classList.add('was-validated')
            modal.classList.add('was-validated')
          }
      }



    
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById('registrationForm');
    form.addEventListener('submit', function(event) {
        if (!checkPasswordsMatch()) {
            event.preventDefault(); // Evita el envío del formulario
            form.classList.add('was-validated'); // Aplica la clase was-validated
            var confirm = document.getElementById('p2');
            confirm.innerHTML = "Las claves no coinciden";
            inputP2 = document.getElementById('password2')
            inputP2.classList.remove('is-valid');
            inputP2.classList.add('is-invalid');
            inputP2.style.borderColor = "red"
            console.log(document.getElementById('password2'))
        }else if (checkPasswordsMatch() != 'vacio'){
            inputP2 = document.getElementById('password2')
            inputP2.classList.add('is-valid');
            inputP2.classList.remove('is-invalid');
            inputP2.style.borderColor = "green"
        }
    });
  });

  function checkPasswordsMatch() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('password2').value;
    if (password === ''){
        return 'vacio'
    }
    return password === confirmPassword; // Devuelve true si las contraseñas coinciden
  }

  async function deleteUser(id){
        Swal.fire({
            title: "En realidad desea eliminar el usuario?",
            text: 'Esta accion no podra ser reversada!!',
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            iconHtml: '<img class="img-delete" src="/public/img/Delete.png">',
            customClass: {
                icon: 'img-delete'
            },
            //confirmButtonText: "Save",
            denyButtonText: `Confirmar`
            }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isDenied) {
                try {
                    const response = await fetch(`/usersManageDelete/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            //data si es necesaria
                        }),
                    });
                    const jsonResponse = await response.json();
                    if (jsonResponse.deleted){
                        Swal.fire("Se elimino el registro", "", "success");
                        setTimeout(() => {
                            location.reload()
                        }, 1000);
                    }else{
                        Swal.fire("Error al eliminar el registro", "", "error");
                    }
                } catch (error) {
                    console.error(new Error(error))
                }
            }
        });
  };

async function deleteDevice(rute,id){
      Swal.fire({
          title: "En realidad desea eliminar el item?",
          text: 'Esta accion no podra ser reversada!!',
          showDenyButton: true,
          showCancelButton: true,
          showConfirmButton: false,
          iconHtml: '<img class="img-delete" src="/public/img/Delete.png">',
          customClass: {
              icon: 'img-delete'
          },
          //confirmButtonText: "Save",
          denyButtonText: `Confirmar`
          }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isDenied) {
              try {
                  const response = await fetch(rute+'/'+id, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          //data si es necesaria
                      }),
                  });
                  const jsonResponse = await response.json();
                  if (jsonResponse.deleted){
                      Swal.fire("Se elimino el registro", "", "success");
                      setTimeout(() => {
                          location.reload()
                      }, 1000);
                  }else{
                      Swal.fire("Error al eliminar el registro", "", "error");
                  }
              } catch (error) {
                  console.error(new Error(error))
              }
          }
      });
}

    webSocket = new WebSocket('ws://10.42.0.53:3001');

    webSocket.onopen = () =>{
      let data = {};
      data.type = 'helo';
      data.path = window.location.pathname;
      webSocket.send(JSON.stringify(data));
    }
    
    webSocket.onmessage = (message) =>{
        let nas = JSON.parse(message.data)
        let nasObj = document.getElementById(nas.nas);
        if(nas.status){
            nasObj.classList.remove('red');
            nasObj.classList.add('gren');
        }else{
            nasObj.classList.remove('gren');
            nasObj.classList.add('red'); 
        }
        console.log(nas)
    }
