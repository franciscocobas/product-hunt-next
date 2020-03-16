import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import Error404 from "../../components/layout/404";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Layout from "../../components/layout/layout";
import Boton from "../../components/ui/Boton";

import { FirebaseContext } from "../../firebase";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const Producto = () => {
  const [producto, setProducto] = useState("");
  const [error, setError] = useState(false);

  // Router para obtener el id actual
  const router = useRouter();
  const {
    query: { id }
  } = router;

  const { firebase, user } = useContext(FirebaseContext);

  useEffect(() => {
    if (id) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          setProducto(producto.data());
        } else {
          setError(true);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0) return "Cargando...";

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador
  } = producto;

  // Administrar y validar los votos
  const votarProducto = () => {
    if (!user) {
      return router.push("/login");
    }
    // Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    // Actualizar en la BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({
        votos: nuevoTotal
      });

    // Actualizar el state
    setProducto({
      ...producto,
      voto: nuevoTotal
    });
  };

  return (
    <Layout>
      <>
        {error && <Error404 />}
        <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {nombre}
          </h1>
          <ContenedorProducto>
            <div>
              <p>
                Publicado hace:{" "}
                {formatDistanceToNow(new Date(creado), { locale: es })}
              </p>
              <p>
                Por: {creador.nombre} de {empresa}
              </p>
              <img src={urlimagen} />
              <p>{descripcion}</p>

              {user && (
                <>
                  <h2>Agrega tu comentario</h2>
                  <form>
                    <Campo>
                      <input type="text" name="mensaje" />
                    </Campo>
                    <InputSubmit type="submit" value="Agregar Comentario" />
                  </form>
                </>
              )}
              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comentarios
              </h2>
              {comentarios.map(comentario => (
                <li>
                  <p>{comentario.nombre}</p>
                  <p>Escrito por: {comentario.usuarioNombre}</p>
                </li>
              ))}
            </div>
            <aside>
              <Boton target="_blank" bgColor={true} href={url}>
                Visitar URL
              </Boton>

              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                <p
                  css={css`
                    text-align: center;
                  `}
                >
                  {votos} Votos
                </p>
                {user && <Boton onClick={votarProducto}>Votar</Boton>}
              </div>
            </aside>
          </ContenedorProducto>
        </div>
      </>
    </Layout>
  );
};

export default Producto;
