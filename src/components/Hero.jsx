function Hero() {
  return (
    <section className="heroPrincipal">
      <div className="heroContenido">
        <div className="heroTexto">
          <p className="heroEtiqueta">
            CONVOCATORIA ABIERTA · LIMA, 12 Y 13 DE NOVIEMBRE DE 2026
          </p>

          <h1>VIII Congreso Académico Estudiantil</h1>

          <p className="heroDescripcion">
            Presenta tu investigación ante el comité y la comunidad universitaria.
            Recibimos artículos completos, resúmenes extendidos, pósteres y casos
            de estudio en seis ejes temáticos.
          </p>
        </div>

        <div className="heroBotones">
          <button className="botonPrincipal">Enviar mi trabajo</button>
          <button className="botonSecundario">Descargar las bases</button>
        </div>
      </div>
    </section>
  )
}

export default Hero