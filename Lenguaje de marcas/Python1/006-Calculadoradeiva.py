#En un programa, primero da la bienvenida
print ("Programa calculador del IVA")
print ("Por Héctor Quirós Pérez")

#A continuacion, toma datos de entrada
base_imponible = input("Introduce la base imponible: ")

#Ahora realiza cálculos con esos datos:
base_imponible = float(base_imponible)      #Convierto la base a número con decimales
iva = base_imponible * 0.21                 #Calculo el IVA
total = base_imponible + iva                #Calculo el total

#Ahora ofrezco una salida

print ("Resultado del cálculo:")
print ("Tu base imponible:" ,base_imponible)
print ("IVA 21%:" , iva)
print ("Total de la factura:" ,total)