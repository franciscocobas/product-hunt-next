import React, { useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";
import Boton from "../ui/Boton";
import { FirebaseContext } from "../../firebase";

const ContendedorHeader = styled.div`
  max-width: 1220px;
  width: 95%;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Logo = styled.a`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto Slab", serif;
  margin-right: 2rem;
`;

const Header = () => {
  const { user, firebase } = useContext(FirebaseContext);

  return (
    <header
      css={css`
        border-bottom: 2px solid var(--gris3);
        padding: 1rem 0;
      `}
    >
      <ContendedorHeader>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Link href="/">
            <Logo>P</Logo>
          </Link>
          <Buscar />
          <Navegacion />
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          {user ? (
            <>
              <p
                css={css`
                  margin-right: 2rem;
                `}
              >
                Hola: {user.displayName}
              </p>
              <Boton bgColor={true} onClick={() => firebase.cerrarSesion()}>
                Cerrar Sesion
              </Boton>
            </>
          ) : (
            <>
              <Link href="/login">
                <Boton bgColor={true}>Login</Boton>
              </Link>
              <Link href="/crear-cuenta">
                <Boton>Crear Cuenta</Boton>
              </Link>
            </>
          )}
        </div>
      </ContendedorHeader>
    </header>
  );
};

export default Header;
