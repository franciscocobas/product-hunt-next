import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Error404 from '../../components/layout/404';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Layout from '../../components/layout/layout';
import Boton from '../../components/ui/Boton';

import { FirebaseContext } from '../../firebase_helpers';

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  const [producto, setProducto] = useState('');
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setConsultarDB] = useState(true);

  // Router para obtener el id actual
  const router = useRouter();
  const {
    query: { id }
  } = router;

  const { firebase, user } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection('productos').doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          setProducto(producto.data());
          setConsultarDB(false);
        } else {
          setError(true);
          setConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return 'Cargando...';

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado
  } = producto;

  // Administrar y validar los votos
  const votarProducto = () => {
    if (!user) {
      return router.push('/login');
    }
    // Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    // Actualizar en la BD
    firebase.db
      .collection('productos')
      .doc(id)
      .update({
        votos: nuevoTotal
      });

    // Verificar si el usuario actual ha votado
    if (haVotado.include(user.uid)) return;

    // Guardar el ID del usuario que ha votado
    const nuevoHaVotado = [...haVotado, user.uid];

    // Actualizar el state
    setProducto({
      ...producto,
      voto: nuevoTotal,
      haVotado: nuevoHaVotado
    });
    setConsultarDB(true);
  };

  // Funciones para guardar comentarios
  const comentarioChange = e => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value
    });
  };

  // Identifica si el comentario es del creador del producto
  const esCreador = id => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = e => {
    e.preventDefault();

    if (!user) {
      return router.push('/login');
    }

    // Informacion extra al comentario
    comentario.usuarioId = user.uid;
    comentario.usuarioNombre = user.displayName;

    // Tomar copia de comentarios  y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    // Actualizar BD
    firebase.db
      .collection('productos')
      .doc(id)
      .update({
        comentarios: nuevosComentarios
      });

    // Actualizar State
    setProducto({
      ...producto,
      comentarios: nuevosComentarios
    });
    setConsultarDB(true);
  };

  const puedeBorrar = () => {
    if (!user) return false;

    if (creador.id === user.uid) {
      return true;
    }
  };

  // Elimina un producto en la BD
  const eliminarProducto = async () => {
    if (!user) {
      return router.push('/login');
    }
    if (creador.id !== user.uid) {
      return router.push('/');
    }
    try {
      await firebase.db
        .collection('productos')
        .doc(id)
        .delete();
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
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
                  Publicado hace:{' '}
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
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentarioChange}
                        />
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
                {comentarios.length === 0 ? (
                  'Aún no hay comentarios. '
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:{' '}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {''}
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
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

            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
