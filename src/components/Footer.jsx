function Footer() {
  return (
    <footer className="footerPrincipal">
      <div className="footerContenido">
        <div className="footerColumna">
          <h3>Congreso Académico Estudiantil</h3>
          <p>
            Facultad de Ingeniería · Universidad de Lima.
            Av. Javier Prado Este 4600, Santiago de Surco, Lima.
          </p>
        </div>

        <div className="footerColumna">
          <h4>EL CONGRESO</h4>
          <p>Bases y requisitos</p>
          <p>Ejes temáticos</p>
          <p>Programa</p>
        </div>

        <div className="footerColumna">
          <h4>PARTICIPANTES</h4>
          <p>Guía para autores</p>
          <p>Guía para revisores</p>
          <p>Preguntas frecuentes</p>
        </div>

        <div className="footerColumna">
          <h4>CONTACTO</h4>
          <p>congreso@ulima.edu.pe</p>
          <p>(01) 437 6767 anexo 30450</p>
        </div>
      </div>

      <div className="footerInferior">
        <span>© 2026 Universidad de Lima. Todos los derechos reservados.</span>

        <div>
          <span>Términos de uso</span>
          <span>Política de privacidad</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer