window.MADERA_APPS=[
  {
    "id": "A1",
    "file": "01_Laboratorio_de_la_madera.html",
    "title": "Laboratorio de la madera",
    "block": "Estructura y propiedades",
    "time": "15–20 min",
    "intro": "Observa el tronco, compara densidades y relaciona las propiedades con sus usos.",
    "section": "1 a 3",
    "questions": [
      {
        "type": "fields",
        "title": "Un tronco por dentro",
        "prompt": "En el dibujo, las cinco zonas están numeradas desde el exterior hacia el centro. Relaciona estas tres.",
        "fields": [
          {
            "label": "Zona 1",
            "options": [
              "Corteza",
              "Duramen",
              "Médula"
            ],
            "answer": "Corteza"
          },
          {
            "label": "Zona 2",
            "options": [
              "Cámbium",
              "Médula",
              "Albura"
            ],
            "answer": "Cámbium"
          },
          {
            "label": "Zona 4",
            "options": [
              "Duramen",
              "Corteza",
              "Albura"
            ],
            "answer": "Duramen"
          }
        ],
        "explain": "El orden es corteza, cámbium, albura, duramen y médula.",
        "visual": "trunk",
        "hint": "Cada relación se valora por separado.",
        "id": "A1-1"
      },
      {
        "type": "choice",
        "title": "Dos componentes",
        "prompt": "¿Qué explicación de celulosa y lignina es adecuada?",
        "options": [
          "La celulosa forma parte de la estructura fibrosa y la lignina contribuye a su rigidez y cohesión.",
          "La lignina es la corteza y la celulosa es siempre el 100 % de la madera.",
          "La celulosa sirve solo para alimentar al árbol como una esponja."
        ],
        "answer": 0,
        "explain": "Sus proporciones varían. La comparación de fibras y unión ayuda a comprender, pero no describe todos los componentes.",
        "visual": "wood",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A1-2"
      },
      {
        "type": "number",
        "title": "Contar el crecimiento",
        "prompt": "En un esquema ideal de crecimiento anual se observan 12 bandas claras y 12 oscuras, agrupadas en parejas. ¿Cuántos años representan?",
        "answer": 12,
        "unit": "años",
        "tolerance": 0.005,
        "explain": "Una pareja temprana-tardía forma un anillo anual en este esquema. Son 12 parejas, no 24 años.",
        "visual": "rings",
        "hint": "Cuenta las parejas completas, no cada banda por separado.",
        "id": "A1-3"
      },
      {
        "type": "number",
        "title": "Calcula la densidad",
        "prompt": "Un taco tiene 60 g de masa y 100 cm³ de volumen. Escribe su densidad. Puedes usar coma o punto decimal.",
        "answer": 0.6,
        "unit": "g/cm³",
        "tolerance": 0.005,
        "explain": "60 ÷ 100 = 0,60 g/cm³. Los datos son didácticos, no identifican una especie.",
        "visual": "density",
        "hint": "Densidad = masa dividida entre volumen.",
        "id": "A1-4"
      },
      {
        "type": "choice",
        "title": "El mismo volumen",
        "prompt": "Dos tacos ocupan 100 cm³. A tiene 60 g y B tiene 80 g. ¿Cuál es más denso?",
        "options": [
          "B",
          "A",
          "Son igual de densos porque ocupan lo mismo."
        ],
        "answer": 0,
        "explain": "Con el mismo volumen, el de mayor masa tiene mayor densidad. A: 0,60; B: 0,80 g/cm³.",
        "visual": "density",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A1-5"
      },
      {
        "type": "choice",
        "title": "Humedad del ambiente",
        "prompt": "Una pieza cambia de dimensiones al intercambiar humedad con el ambiente. ¿Qué propiedad explica esto?",
        "options": [
          "Opacidad",
          "Higroscopicidad",
          "Dureza"
        ],
        "answer": 1,
        "explain": "La madera puede absorber o perder humedad y experimentar hinchamiento o contracción.",
        "visual": "humidity",
        "hint": "Busca la propiedad relacionada con el agua del ambiente.",
        "id": "A1-6"
      },
      {
        "type": "fields",
        "title": "Tres esfuerzos",
        "prompt": "Relaciona las acciones con el esfuerzo.",
        "fields": [
          {
            "label": "Tirar de los extremos",
            "options": [
              "Tracción",
              "Compresión",
              "Flexión"
            ],
            "answer": "Tracción"
          },
          {
            "label": "Aplastar una pieza",
            "options": [
              "Tracción",
              "Compresión",
              "Flexión"
            ],
            "answer": "Compresión"
          },
          {
            "label": "Curvar una balda entre apoyos",
            "options": [
              "Tracción",
              "Compresión",
              "Flexión"
            ],
            "answer": "Flexión"
          }
        ],
        "explain": "Tracción estira; compresión acorta o aplasta; flexión curva y combina zonas que se estiran y comprimen.",
        "visual": "forces",
        "hint": "Cada relación se valora por separado.",
        "id": "A1-7"
      },
      {
        "type": "choice",
        "title": "La dirección importa",
        "prompt": "La madera no se comporta igual en todas las direcciones. ¿Cómo se llama esta propiedad?",
        "options": [
          "Transparencia",
          "Anisotropía",
          "Reciclabilidad"
        ],
        "answer": 1,
        "explain": "La estructura orientada de las fibras hace que el comportamiento dependa de la dirección.",
        "visual": "grain",
        "hint": "La veta da una pista de la dirección de la estructura.",
        "id": "A1-8"
      },
      {
        "type": "choice",
        "title": "Resistir una marca",
        "prompt": "Si queremos comparar la oposición a que una superficie sea rayada, comparamos su…",
        "options": [
          "Dureza",
          "Color",
          "Volumen"
        ],
        "answer": 0,
        "explain": "La dureza se relaciona con rayado o penetración; no es lo mismo que resistir cualquier carga.",
        "visual": "wood",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A1-9"
      },
      {
        "type": "choice",
        "title": "Elegir un mango",
        "prompt": "¿Qué propiedad ayuda a explicar el uso de madera en un mango frente a un metal?",
        "options": [
          "Su menor facilidad para transmitir calor.",
          "Que toda madera es transparente.",
          "Que toda madera es impermeable."
        ],
        "answer": 0,
        "explain": "La madera es relativamente mala conductora térmica. Siempre hay que usar un utensilio diseñado para su función.",
        "visual": "wood",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A1-10"
      }
    ]
  },
  {
    "id": "A2",
    "file": "02_Del_bosque_al_taller.html",
    "title": "Del bosque al taller",
    "block": "Obtención y madera natural",
    "time": "15–20 min",
    "intro": "Ordena la transformación, distingue operaciones y selecciona las piezas que llegan al taller.",
    "section": "4 y 5",
    "questions": [
      {
        "type": "order",
        "title": "Del tronco a una pieza",
        "prompt": "Ordena la secuencia general del temario. El proceso real puede presentar variaciones.",
        "fields": [
          {
            "label": "Transporte",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7"
            ],
            "answer": "2"
          },
          {
            "label": "Descortezado",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7"
            ],
            "answer": "3"
          },
          {
            "label": "Secado",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7"
            ],
            "answer": "5"
          },
          {
            "label": "Aserrado",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7"
            ],
            "answer": "4"
          },
          {
            "label": "Tala y desramado",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7"
            ],
            "answer": "1"
          },
          {
            "label": "Cepillado y lijado",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7"
            ],
            "answer": "6"
          },
          {
            "label": "Tratamientos y acabados",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7"
            ],
            "answer": "7"
          }
        ],
        "explain": "Es una secuencia general: cada operación prepara el material para las siguientes.",
        "visual": "process",
        "hint": "Asigna una posición diferente a cada etapa. Piensa qué necesita estar preparado antes.",
        "id": "A2-1"
      },
      {
        "type": "choice",
        "title": "Descortezar",
        "prompt": "¿Qué se retira durante el descortezado?",
        "options": [
          "Toda la albura y el duramen",
          "El acabado de una mesa usada",
          "La corteza"
        ],
        "answer": 2,
        "explain": "Descortezar es retirar la corteza del tronco.",
        "visual": "process",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A2-2"
      },
      {
        "type": "choice",
        "title": "Obtener tablas",
        "prompt": "¿Qué operación divide el tronco con sierras para obtener piezas aprovechables?",
        "options": [
          "Barnizado",
          "Secado",
          "Aserrado"
        ],
        "answer": 2,
        "explain": "El aserrado permite obtener tablas, tablones u otras piezas.",
        "visual": "process",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A2-3"
      },
      {
        "type": "choice",
        "title": "Preparar la humedad",
        "prompt": "¿Cuál es la explicación adecuada del secado?",
        "options": [
          "Eliminar siempre absolutamente toda el agua.",
          "Aplicar pintura para ocultar las grietas.",
          "Reducir y controlar la humedad para el uso previsto."
        ],
        "answer": 2,
        "explain": "El objetivo es preparar el material y reducir problemas de cambio de dimensiones o deformación.",
        "visual": "humidity",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A2-4"
      },
      {
        "type": "fields",
        "title": "No son la misma operación",
        "prompt": "Asocia cada actuación con su finalidad principal.",
        "fields": [
          {
            "label": "Cepillar",
            "options": [
              "Regularizar con una herramienta de corte",
              "Suavizar con un abrasivo",
              "Aplicar una capa de acabado"
            ],
            "answer": "Regularizar con una herramienta de corte"
          },
          {
            "label": "Lijar",
            "options": [
              "Regularizar con una herramienta de corte",
              "Suavizar con un abrasivo",
              "Aplicar una capa de acabado"
            ],
            "answer": "Suavizar con un abrasivo"
          },
          {
            "label": "Barnizar",
            "options": [
              "Regularizar con una herramienta de corte",
              "Suavizar con un abrasivo",
              "Aplicar una capa de acabado"
            ],
            "answer": "Aplicar una capa de acabado"
          }
        ],
        "explain": "Cepillado y lijado preparan superficies; el barnizado es un acabado cuando procede.",
        "visual": "forms",
        "hint": "Cada relación se valora por separado.",
        "id": "A2-5"
      },
      {
        "type": "fields",
        "title": "Formas comerciales",
        "prompt": "Relaciona cada descripción con una forma.",
        "fields": [
          {
            "label": "Lámina fina",
            "options": [
              "Tabla",
              "Listón",
              "Chapa"
            ],
            "answer": "Chapa"
          },
          {
            "label": "Pieza larga de sección pequeña",
            "options": [
              "Tabla",
              "Listón",
              "Chapa"
            ],
            "answer": "Listón"
          },
          {
            "label": "Pieza plana y alargada",
            "options": [
              "Tabla",
              "Listón",
              "Chapa"
            ],
            "answer": "Tabla"
          }
        ],
        "explain": "No basta con el nombre: también se deben comprobar las medidas concretas.",
        "visual": "forms",
        "hint": "Cada relación se valora por separado.",
        "id": "A2-6"
      },
      {
        "type": "choice",
        "title": "Madera maciza",
        "prompt": "Una tabla está aserrada, seca y cepillada. ¿Puede seguir siendo madera maciza?",
        "options": [
          "Sí, mantiene la estructura de la madera del árbol.",
          "No, cualquier preparación la convierte en papel.",
          "No, toda tabla cepillada es aglomerado."
        ],
        "answer": 0,
        "explain": "Natural o maciza no significa que la madera no se haya preparado.",
        "visual": "wood",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A2-7"
      },
      {
        "type": "choice",
        "title": "Elegir una pieza",
        "prompt": "¿Qué conviene revisar antes de elegir una pieza para el taller?",
        "options": [
          "Solo el nombre comercial, sin medir.",
          "Solo que tenga un color bonito.",
          "Dimensiones, rectitud, grietas, nudos, veta y condiciones de uso."
        ],
        "answer": 2,
        "explain": "La elección exige observar la pieza concreta y relacionarla con la función.",
        "visual": "forms",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A2-8"
      },
      {
        "type": "choice",
        "title": "Aprovechar restos",
        "prompt": "Tras el aserrado aparecen recortes, virutas y serrín. ¿Qué decisión es adecuada?",
        "options": [
          "Valorar su aprovechamiento en otros productos cuando sean adecuados.",
          "Afirmar que nunca sirven para nada.",
          "Mezclarlos automáticamente con papel limpio."
        ],
        "answer": 0,
        "explain": "Parte de los restos puede aprovecharse; el tipo de material y su estado importan.",
        "visual": "offcuts",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A2-9"
      },
      {
        "type": "choice",
        "title": "Dura o blanda",
        "prompt": "¿Qué regla evita una clasificación equivocada?",
        "options": [
          "Toda madera oscura es dura.",
          "Todas las frondosas tienen exactamente la misma dureza.",
          "La dureza no se deduce siempre del color o del tipo de hoja."
        ],
        "answer": 2,
        "explain": "Los grupos botánicos y las características visibles no sustituyen comprobar las propiedades.",
        "visual": "wood",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A2-10"
      }
    ]
  },
  {
    "id": "A3",
    "file": "03_Observatorio_de_tableros.html",
    "title": "Observatorio de tableros",
    "block": "Tableros y otros materiales de los árboles",
    "time": "20–25 min",
    "intro": "Observa los cantos, distingue chapas, partículas y fibras, y reconstruye el recorrido del papel.",
    "section": "6 a 8",
    "questions": [
      {
        "type": "choice",
        "title": "Capas en el canto",
        "prompt": "El esquema muestra un tablero de chapas encoladas con direcciones cruzadas. ¿Cuál es?",
        "options": [
          "Papel",
          "Aglomerado",
          "Contrachapado"
        ],
        "answer": 2,
        "explain": "El contrachapado está formado por chapas. Cruzar la orientación ayuda al comportamiento del conjunto.",
        "visual": "plywood",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A3-1"
      },
      {
        "type": "choice",
        "title": "Fragmentos visibles",
        "prompt": "En el canto se distinguen partículas o virutas prensadas. ¿Qué tablero representa?",
        "options": [
          "Contrachapado",
          "Madera maciza",
          "Aglomerado"
        ],
        "answer": 2,
        "explain": "El aglomerado se fabrica con partículas o virutas unidas con resinas y prensadas.",
        "visual": "particle",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A3-2"
      },
      {
        "type": "choice",
        "title": "Estructura fina",
        "prompt": "El tablero está formado por fibras desfibradas unidas y prensadas. ¿Qué opción corresponde al ejemplo del temario?",
        "options": [
          "DM o MDF",
          "Contrachapado de chapas",
          "Corcho de la corteza"
        ],
        "answer": 0,
        "explain": "El DM se fabrica con fibras; no es lo mismo que un tablero de partículas.",
        "visual": "mdf",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A3-3"
      },
      {
        "type": "choice",
        "title": "Fondo de un cajón",
        "prompt": "¿Qué material del temario aparece como tablero fino en traseras y fondos de cajones?",
        "options": [
          "Tablero de fibras duro o táblex",
          "Un lingote de metal",
          "Un tronco completo"
        ],
        "answer": 0,
        "explain": "El tablero de fibras duro puede emplearse en estos elementos. La elección concreta depende del producto.",
        "visual": "hardboard",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A3-4"
      },
      {
        "type": "fields",
        "title": "Materia de partida",
        "prompt": "Relaciona cada tablero con su estructura.",
        "fields": [
          {
            "label": "Contrachapado",
            "options": [
              "Chapas",
              "Partículas",
              "Fibras"
            ],
            "answer": "Chapas"
          },
          {
            "label": "Aglomerado",
            "options": [
              "Chapas",
              "Partículas",
              "Fibras"
            ],
            "answer": "Partículas"
          },
          {
            "label": "DM",
            "options": [
              "Chapas",
              "Partículas",
              "Fibras"
            ],
            "answer": "Fibras"
          }
        ],
        "explain": "Reconocer la estructura evita confundir productos con superficies similares.",
        "visual": "boards",
        "hint": "Cada relación se valora por separado.",
        "id": "A3-5"
      },
      {
        "type": "order",
        "title": "El recorrido del papel",
        "prompt": "Ordena las cinco fases del esquema didáctico.",
        "fields": [
          {
            "label": "Secar y acabar",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5"
            ],
            "answer": "5"
          },
          {
            "label": "Obtener o recuperar fibras",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5"
            ],
            "answer": "1"
          },
          {
            "label": "Formar una lámina",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5"
            ],
            "answer": "3"
          },
          {
            "label": "Retirar agua y prensar",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5"
            ],
            "answer": "4"
          },
          {
            "label": "Preparar mezcla de fibras y agua",
            "options": [
              "1",
              "2",
              "3",
              "4",
              "5"
            ],
            "answer": "2"
          }
        ],
        "explain": "Es un esquema simplificado: las operaciones industriales concretas dependen del producto.",
        "visual": "paper",
        "hint": "Asigna una posición diferente a cada etapa. Piensa qué necesita estar preparado antes.",
        "id": "A3-6"
      },
      {
        "type": "choice",
        "title": "Una tabla y una hoja",
        "prompt": "¿Por qué el papel no es simplemente una tabla muy fina?",
        "options": [
          "Porque se fabrica separando y reuniendo fibras de celulosa.",
          "Porque nunca tiene relación con los árboles.",
          "Porque siempre se fabrica con partículas de metal."
        ],
        "answer": 0,
        "explain": "Las fibras pueden ser vírgenes o recuperadas de papel y cartón usados.",
        "visual": "paper",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A3-7"
      },
      {
        "type": "choice",
        "title": "Cartón ondulado",
        "prompt": "¿Qué estructura ves en un cartón ondulado?",
        "options": [
          "Chapas de madera maciza siempre cruzadas.",
          "Un tronco pequeño sin transformar.",
          "Una capa con ondas entre caras planas."
        ],
        "answer": 2,
        "explain": "La estructura aporta rigidez sin que todo el espesor sea material macizo.",
        "visual": "cardboard",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A3-8"
      },
      {
        "type": "choice",
        "title": "De dónde sale el corcho",
        "prompt": "¿Cuál es el origen del corcho del temario?",
        "options": [
          "La médula de cualquier árbol",
          "Fibras de papel prensadas",
          "La corteza del alcornoque"
        ],
        "answer": 2,
        "explain": "Es de origen vegetal, pero se diferencia de las tablas y de los tableros fabricados a partir de madera.",
        "visual": "cork",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A3-9"
      },
      {
        "type": "choice",
        "title": "Sin reglas absolutas",
        "prompt": "¿Qué afirmación es correcta?",
        "options": [
          "La aptitud de un tablero para humedad o exterior depende del producto y sus condiciones de uso.",
          "El caucho es un tablero de madera.",
          "Todos los tableros son impermeables e inmunes a insectos."
        ],
        "answer": 0,
        "explain": "Ni el origen vegetal ni un acabado superficial garantizan todas las prestaciones.",
        "visual": "boards",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A3-10"
      }
    ]
  },
  {
    "id": "A4",
    "file": "04_Decisiones_con_madera.html",
    "title": "Decisiones con madera",
    "block": "Selección y sostenibilidad",
    "time": "15–20 min",
    "intro": "Resuelve situaciones cercanas, compara opciones y justifica decisiones de uso y ahorro.",
    "section": "9 y 10",
    "questions": [
      {
        "type": "choice",
        "title": "Primero la necesidad",
        "prompt": "Antes de escoger material para una caja de tarjetas, ¿qué hay que definir?",
        "options": [
          "Una especie al azar y después inventar la necesidad.",
          "Solo el color del acabado.",
          "La función, las dimensiones necesarias y las condiciones de uso."
        ],
        "answer": 2,
        "explain": "El material se elige para responder a una necesidad concreta.",
        "visual": "case",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-1"
      },
      {
        "type": "choice",
        "title": "Probar una idea",
        "prompt": "Queremos comprobar rápidamente la forma de una caja pequeña y tenemos cartón recuperado en buen estado. ¿Qué uso razonable puede tener?",
        "options": [
          "Sustituir todas las pruebas y observaciones.",
          "Fabricar un prototipo y comprobar medidas antes de decidir la versión final.",
          "Dar por demostrada la resistencia de cualquier caja de madera."
        ],
        "answer": 1,
        "explain": "Un prototipo sirve para comprobar aspectos concretos; no demuestra todas las prestaciones del producto final.",
        "visual": "cardboard",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-2"
      },
      {
        "type": "choice",
        "title": "Una elección razonada",
        "prompt": "¿Qué justificación es más completa para una caja de interior?",
        "options": [
          "Contrachapado, porque siempre es mejor para todo.",
          "Usaré este recorte de contrachapado si su espesor y estado permiten construir la caja y así aprovecharé material disponible.",
          "El material más oscuro, porque será necesariamente más duro."
        ],
        "answer": 1,
        "explain": "La elección incorpora función, condiciones y aprovechamiento, sin afirmar un ganador universal.",
        "visual": "case",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-3"
      },
      {
        "type": "choice",
        "title": "Antes de cortar",
        "prompt": "¿Qué medida reduce desperdicios antes de fabricar?",
        "options": [
          "Distribuir las piezas sobre el material y comprobar las medidas.",
          "Escoger siempre la tabla más grande.",
          "Cortar primero sin plan y medir después."
        ],
        "answer": 0,
        "explain": "Planificar ayuda a aprovechar el material y reducir errores.",
        "visual": "offcuts",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-4"
      },
      {
        "type": "choice",
        "title": "Un recorte útil",
        "prompt": "Un recorte adecuado se convierte en un separador sin descomponerlo para obtener nueva materia prima. ¿Qué hacemos?",
        "options": [
          "Reciclar industrialmente",
          "Reutilizar",
          "Desperdiciar"
        ],
        "answer": 1,
        "explain": "Reutilizar es dar un nuevo uso al objeto o material.",
        "visual": "offcuts",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-5"
      },
      {
        "type": "choice",
        "title": "Alargar su vida",
        "prompt": "Una caja tiene una unión suelta que el profesor puede ayudar a arreglar. ¿Qué decisión favorece su duración?",
        "options": [
          "Fabricar otra sin examinar el fallo.",
          "Repararla cuando sea viable.",
          "Afirmar que los productos no necesitan cuidado."
        ],
        "answer": 1,
        "explain": "Mantener y reparar puede evitar consumir nuevos materiales.",
        "visual": "case",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-6"
      },
      {
        "type": "choice",
        "title": "No son el mismo residuo",
        "prompt": "¿Cómo debemos tratar una pieza de madera pintada o encolada?",
        "options": [
          "Seguir las indicaciones de recogida apropiadas para ese material.",
          "Tratarla siempre como papel limpio.",
          "Mezclarla con cualquier residuo sin comprobar."
        ],
        "answer": 0,
        "explain": "El origen vegetal no hace que todos los productos tengan el mismo tratamiento al final de su uso.",
        "visual": "offcuts",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-7"
      },
      {
        "type": "choice",
        "title": "Un tablero al exterior",
        "prompt": "Solo sabemos que un tablero es de interior y está pintado. ¿Qué podemos concluir?",
        "options": [
          "Cualquier tablero pintado es impermeable.",
          "Hay que comprobar si el producto es apto para exterior; la pintura no lo garantiza.",
          "Seguro que es apto para lluvia permanente."
        ],
        "answer": 1,
        "explain": "Las condiciones de fabricación, adhesivos y uso importan.",
        "visual": "humidity",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-8"
      },
      {
        "type": "choice",
        "title": "Lo que puedo observar",
        "prompt": "Vemos la superficie de un mueble, pero no se distingue el canto ni su estructura. ¿Qué respuesta es rigurosa?",
        "options": [
          "No puedo asegurar el material solo con esta observación; necesito más datos.",
          "Es macizo con certeza porque parece madera.",
          "Es DM con certeza porque tiene color marrón."
        ],
        "answer": 0,
        "explain": "Diferenciar observación e interpretación forma parte del análisis.",
        "visual": "boards",
        "hint": "Relaciona la función con una propiedad del material.",
        "id": "A4-9"
      },
      {
        "type": "fields",
        "title": "Tres decisiones de ahorro",
        "prompt": "Relaciona cada acción con el concepto principal.",
        "fields": [
          {
            "label": "Ajustar dimensiones para usar solo lo necesario",
            "options": [
              "Reducir",
              "Reutilizar",
              "Reciclar"
            ],
            "answer": "Reducir"
          },
          {
            "label": "Usar un recorte en una nueva pieza",
            "options": [
              "Reducir",
              "Reutilizar",
              "Reciclar"
            ],
            "answer": "Reutilizar"
          },
          {
            "label": "Transformar residuos para obtener nuevos materiales",
            "options": [
              "Reducir",
              "Reutilizar",
              "Reciclar"
            ],
            "answer": "Reciclar"
          }
        ],
        "explain": "Son actuaciones diferentes; también se puede reparar y mantener para alargar la vida de un objeto.",
        "visual": "offcuts",
        "hint": "Cada relación se valora por separado.",
        "id": "A4-10"
      }
    ]
  }
];
