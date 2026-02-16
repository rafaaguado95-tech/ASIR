#En un programa, primero da la bienvenida
print ("Programa calculador del doble de la edad v0.1")
print ("Por Jose Vicente Carratala")

#A continuacion, toma datos de entrada
edad = input("Introduce tu edad: ")

#Realiza cálculos con esos datos
edad_en_entero = int(edad) #convierto la edad en un número entero 
doble = edad_en_entero*2

#Por último, ofrece una salida
print("El doble de tu edad es: ", doble)