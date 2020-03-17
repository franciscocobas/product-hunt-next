import React, { useState, useContext } from "react";
import Layout from "../components/layout/layout";
import { css } from "@emotion/core";
import Router, { useRouter } from "next/router";
import FileUploader from "react-firebase-file-uploader";
import Error404 from "../components/layout/404";

import {
  Formulario,
  Campo,
  InputSubmit,
  Error
} from "../components/ui/Formulario";

import { FirebaseContext } from "../firebase";

// Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  url: "",
  descripcion: ""
};
const NuevoProducto = () => {
  // state de las imagenes
  const [nombreImagen, setNombreImagen] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlimagen, setUrlimagen] = useState("");

  const [error, setError] = useState(false);

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = values;

  // hook de routing para redireccionar
  const router = useRouter();

  // Context con las operaciones CRUD de firebase
  const { user, firebase } = useContext(FirebaseContext);

  async function crearProducto() {
    // si el usuario no esta autenticado llevar a login
    if (!user) {
      return router.push("/login");
    }

    // Crear el objeto del nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: user.uid,
        nombre: user.displayName
      },
      haVotado: []
    };

    // insertarlo en la base de datos
    firebase.db.collection("productos").add(producto);

    return router.push("/");
  }

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };

  const handleProgress = progreso => setProgreso({ progreso });

  const handleUploadError = error => {
    setSubiendo(false);
    console.error(error);
  };

  const handleUploadSuccess = nombre => {
    setProgreso(100);
    setSubiendo(false);
    setNombreImagen(nombre);
    firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url => {
        console.log(url);
        setUrlimagen(url);
      });
  };

  return (
    <div>
      <Layout>
        {!user ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo Producto
            </h1>
            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Información general</legend>
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Tu nombre"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errors.nombre && <Error>{errors.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Tu Empresa o Compañía"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errors.empresa && <Error>{errors.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>

                <Campo>
                  <label htmlFor="url">Url</label>
                  <input
                    type="url"
                    placeholder="URL de tu producto"
                    id="url"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errors.url && <Error>{errors.url}</Error>}
              </fieldset>
              <fieldset>
                <legend>Sobre tu Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errors.descripcion && <Error>{errors.descripcion}</Error>}
              </fieldset>

              {error && <Error>{error}</Error>}
              <InputSubmit type="submit" value="Crear Producto" />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
};

export default NuevoProducto;
