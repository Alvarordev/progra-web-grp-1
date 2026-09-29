function Header() {
  return (
    <>
      <header className="headerPrincipal">
        <div className="headerIzquierda">
          <h2>Congreso Académico Estudiantil</h2>
          <p>UNIVERSIDAD DE LIMA · EDICIÓN 2026</p>
        </div>

        <div className="headerDerecha">
          <p>ESTADO DE LA EDICIÓN</p>
          <span>Recepción abierta</span>
        </div>
      </header>

      <nav className="barraNavegacion">
        <div className="navIzquierda">
          <span>Inicio</span>
          <span>Bases del congreso</span>
          <span>Ejes temáticos</span>
          <span>Programa</span>
        </div>

        <div className="navDerecha">
          <button>Iniciar sesión</button>
          <button className="crearCuenta">Crear cuenta</button>
        </div>
      </nav>
    </>
  )
}

export default Header