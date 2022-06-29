#Permite acceder a las funcionalidades del sistema operativo
import os
#Import flask library
from flask import Flask, render_template, request

#Iniciar variable de aplicacion 
app = Flask(__name__)
app.debug = False
#Instanciamiento de la carpeta Static para acceder 
app._static_folder = os.path.abspath("templates/static/")

#ruta principal 
@app.route("/")
#Función principal que llamará a la página HTML
def principal():
    return render_template("layouts/index.html")

# main del programa 
if __name__ == "__main__":
    #debug = true, para reiniciar automaticamente el servidor, tiempo de desarrollo
    app.run(debug=True) # Para ejecutar la aplicacion