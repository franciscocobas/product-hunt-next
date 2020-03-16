export default function validarCrearProducto(valores) {
  let errores = {};

  // validar nombre usuario
  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }
  // validar empresa
  if (!valores.empresa) {
    errores.empresa = "Nombre de empresa es obligatorio";
  }
  // validar la url
  if (!valores.url) {
    errores.url = "La URL del producto es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL mal formateada o no valida";
  }

  // validar descripcion
  if (!valores.descripcion) {
    errores.descripcion = "Agrega una descripcion de tu producto";
  }

  return errores;
}
