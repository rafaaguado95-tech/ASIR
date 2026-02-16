#En un programa, primero da la bienvenida
print ("Clasificacion de rendimiento")

#A continuacion, toma datos de entrada
puntuacion_de_jugador = int(input("introduce la puntuacion:"))

#Ahora realiza cálculos con esos datos
if puntuacion_de_jugador <=10:
    print("Rendimiento bajo")
elif puntuacion_de_jugador  >=11 and puntuacion_de_jugador <= 19:
    print("Rendimiento medio")
elif puntuacion_de_jugador >=20 and puntuacion_de_jugador <= 29:
    print("Rendimiento alto")
elif puntuacion_de_jugador >= 30:
    print("Rendimiento estrella")
else: 
    print("Puntuacion no valida")


