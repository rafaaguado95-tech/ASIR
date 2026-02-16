'''
Programa calculadora de impuestos por Jose Vicente Carratala
Este programa ilustra el uso de las funciones
Toma como entrada una base imponible
Devuelve como resultado el iva y el total
'''

##########    DECLARO FUNCIONES

#Recomendable verbo + objeto directo
def calculaIVA(importe):
    iva = importe*0.21
    return iva

def calculototal(base,iva):
    total = base + iva
    return total

##########    INTRODUZCO DATOS

print("Programa calculador de facturas v0.1 por Héctor Quirós Pérez")
base = input("Introduce la base de la factura: ")
base_numerico = float(base)

##########   REALIZO CALCULOS
iva = calculaIVA(base_numerico)     #Utiliza la función de IVA
total_factura = calculototal(base_numerico,iva)

##########    OFREZCO RESULTADOS

print("La base de la factura es: "+str(base_numerico))
print("El IVA es: "+str (iva))
print("La base imponible es: "+str(total_factura))
#Por ultimo realiza una salida