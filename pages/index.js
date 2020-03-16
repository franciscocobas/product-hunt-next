import React, { useEffect, useState, useContext } from "react";
import Layout from "../components/layout/layout";
import { FirebaseContext } from "../firebase";
import DetallesProducto from "../components/layout/DetallesProducto";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = () => {
      firebase.db
        .collection("productos")
        .orderBy("creado", "desc")
        .onSnapshot(manejarSnapshot);
    };
    obtenerProductos();
  }, []);

  function manejarSnapshot(snapshot) {
    const productos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setProductos(productos);
  }

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map(prod => (
                <DetallesProducto key={prod.id} producto={prod} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
