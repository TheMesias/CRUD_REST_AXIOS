const d = document,
      $table = d.querySelector(".crud-table"),
      $form = d.querySelector(".crud-form"),
      $title = d.querySelector(".crud-title"),
      $template = d.getElementById("crud-template").content,
      $fragment = d.createDocumentFragment();

    const getAll = async () => {
      try {
        let res = await axios.get("http://localhost:5000/santos"),
          json = await res.data;

        console.log(json);

        json.forEach(el => {
          $template.querySelector(".name").textContent = el.nombre;
          $template.querySelector(".constellation").textContent = el.constelacion;
          //agregar informacion al boton para cuando seleccionamos el personaje se pasen los datos 
          $template.querySelector(".edit").dataset.id = el.id;
          $template.querySelector(".edit").dataset.name = el.nombre;
          $template.querySelector(".edit").dataset.constellation = el.constelacion;
          //pasar el id al boton 
          $template.querySelector(".delete").dataset.id = el.id;

          let $clone = d.importNode($template, true);
          $fragment.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragment);
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
      }
    }

    d.addEventListener("DOMContentLoaded", getAll);

    d.addEventListener('submit', async e => {
        if(e.target === $form){
            e.preventDefault(); 
            if(!e.target.id.valie){//si esque el id no tiene valor crea un personaje
                //CREATE_POST
                try {
                    let options = {
                        method: "POST", 
                        headers: {
                            "Content-type": "application/json; charset=utf-8",
                        }, 
                        data: JSON.stringify({
                            //inputs del formulario
                            nombre: e.target.nombre.value, 
                            constelacion: e.target.constelacion.value
                        })
                    },
                    
                    res = await axios("http://localhost:5000/santos", options),
                    json = await res.data; 

                    location.reload() //recargar la pagina
                } catch (error) {
                    let message = err.statusText || "Ocurrio un error"; 
                    $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
                }
            }else{
                //UPDATE_PUT
                try {
                    let options = {
                        method: "PUT", 
                        headers: {
                            "Content-type": "application/json; charset=utf-8",
                        }, 
                        data: JSON.stringify({
                            //inputs del formulario
                            nombre: e.target.nombre.value, 
                            constelacion: e.target.constelacion.value
                        })
                    },
                    
                    res = await axios(`http://localhost:5000/santos/${e.target.id.value}`, options), //accede al calor del boton 
                    json = await res.data; 

                    location.reload() //recargar la pagina
                } catch (error) {
                    let message = err.statusText || "Ocurrio un error"; 
                    $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
                }
            }
        }
    })

    d.addEventListener('click', async e => {
        if(e.target.matches(".edit")){
            //pasar los datos del registro al formulario
            $title.textContent = "Editar Santo";
            $form.nombre.value = e.target.dataset.name;
            $form.constelacion.value = e.target.dataset.constellation;
            $form.id.value = e.target.dataset.id;
        }

        if(e.target.matches('.delete')){
            let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);//devuelve un bool (aceptar o cancelar)

            if (isDelete) {
              //Delete - DELETE
                try {
                    let options = {
                        method: "DELETE", 
                        headers: {
                            "Content-type": "application/json; charset=utf-8",
                        }    
                    },
                
                    res = await fetch(`http://localhost:5000/santos/${e.target.dataset.id}`, options), /*Ruta llamanda endpoint*/
                    json = await res.json()
                
                    if(!res.ok) throw {status: res.status, statusText: res.statusText};
                    location.reload(); 
    
                } catch (err) {
                    let message = err.statusText || "Ocurrio un error"; 
                    alert(`Error {err.statu}: ${message}`);
                }   
            }
        }
    })