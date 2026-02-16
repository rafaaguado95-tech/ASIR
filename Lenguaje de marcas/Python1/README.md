# 📘 Guía Completa del Proyecto Python-01

Este proyecto contiene ejercicios básicos para aprender Python desde cero. Cada archivo se explica paso a paso, sin tecnicismos.

---

## ✅ Cómo ejecutar los archivos
1. Abre la terminal.
2. Ve a la carpeta del proyecto:
```bash
cd Python-01
```
3. Ejecuta el archivo que quieras:
```bash
python nombre_del_archivo.py
```
Ejemplo:
```bash
python 001-Salidas.py
```

---

# 🔍 Explicación de cada archivo

## 📂 001-Salidas.py
**¿Qué hace?**
Este archivo enseña cómo mostrar información en pantalla usando print().

### Código comentado:
```python
print("Hola, mundo")  # Muestra el texto Hola, mundo en la pantalla
```
---

## 📂 002-Comentarios.py
**¿Qué hace?**
Este archivo explica cómo escribir comentarios en el código para hacerlo más entendible.

### Código comentado:
```python
# Esto es un comentario. No se ejecuta, sirve para explicar el código
print("Este código funciona")  # Comentario al final de la línea
```
---

## 📂 003-Entradas y Salidad.py
**¿Qué hace?**
Este archivo enseña cómo pedir datos al usuario y mostrarlos en pantalla.

### Código comentado:
```python
nombre = input("Escribe tu nombre: ")  # Pide al usuario que escriba su nombre
print("Hola", nombre)  # Muestra un saludo con el nombre ingresado
```
---

## 📂 004-Operadores aritmeticos.py
**¿Qué hace?**
Este archivo muestra cómo hacer operaciones matemáticas básicas.

### Código comentado:
```python
a = 10  # Primer número
b = 5   # Segundo número
print("Suma:", a + b)  # Sumamos
print("Resta:", a - b)  # Restamos
print("Multiplicación:", a * b)  # Multiplicamos
print("División:", a / b)  # Dividimos
```
---

## 📂 005-Calculadorasencilla.py
**¿Qué hace?**
Este archivo crea una calculadora simple que suma, resta, multiplica y divide.

### Código comentado:
```python
num1 = float(input("Primer número: "))  # Pedimos el primer número
num2 = float(input("Segundo número: "))  # Pedimos el segundo número
print("Suma:", num1 + num2)
print("Resta:", num1 - num2)
print("Multiplicación:", num1 * num2)
print("División:", num1 / num2)
```
---

## 📂 006-Calculadoradeiva.py
**¿Qué hace?**
Este archivo calcula el IVA de un producto a partir de su precio.

### Código comentado:
```python
precio = float(input("Precio del producto: "))  # Pedimos el precio
iva = precio * 0.21  # Calculamos el IVA (21%)
print("IVA:", iva)
print("Precio total:", precio + iva)
```
---

## 📂 007-Comparativos.py
**¿Qué hace?**
Este archivo enseña cómo comparar valores (mayor, menor, igual).

### Código comentado:
```python
a = 10
b = 20
print("¿a es mayor que b?", a > b)  # False
print("¿a es menor que b?", a < b)  # True
print("¿a es igual a b?", a == b)  # False
```
---

## 📂 008-Programar_mayor_o_menor_.py
**¿Qué hace?**
Este archivo determina si un número es mayor o menor que otro.

### Código comentado:
```python
num1 = int(input("Primer número: "))
num2 = int(input("Segundo número: "))
if num1 > num2:
    print("El primer número es mayor")
else:
    print("El segundo número es mayor o son iguales")
```
---

## 📂 009-Estructura repetitiva para.py
**¿Qué hace?**
Este archivo enseña cómo repetir acciones con bucles for.

### Código comentado:
```python
for i in range(5):  # Repetimos 5 veces
    print("Iteración número", i)
```
---

## 📂 010-Semanario.py
**¿Qué hace?**
Este archivo muestra cómo trabajar con días de la semana en una lista.

### Código comentado:
```python
dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
for dia in dias:
    print("Hoy es", dia)
```
---

## 📂 011-Estructura condicional.py
**¿Qué hace?**
Este archivo enseña cómo usar condicionales if, elif y else.

### Código comentado:
```python
edad = int(input("Escribe tu edad: "))
if edad < 18:
    print("Eres menor de edad")
elif edad == 18:
    print("Tienes 18 años")
else:
    print("Eres mayor de edad")
```
---

## 📂 012-caso else.py
**¿Qué hace?**
Este archivo explica el uso del bloque else en condiciones.

### Código comentado:
```python
numero = int(input("Escribe un número: "))
if numero % 2 == 0:
    print("El número es par")
else:
    print("El número es impar")
```
---

## 📂 013-Multiplos rangos.py
**¿Qué hace?**
Este archivo enseña cómo trabajar con rangos y múltiplos en bucles.

### Código comentado:
```python
for i in range(1, 21):  # Números del 1 al 20
    if i % 5 == 0:
        print(i, "es múltiplo de 5")
```
---

## 📂 014-Ejercicio de la mayoría de ed.py
**¿Qué hace?**
Este archivo determina si una persona es mayor de edad según su edad ingresada.

### Código comentado:
```python
edad = int(input("Escribe tu edad: "))
if edad >= 18:
    print("Eres mayor de edad")
else:
    print("Eres menor de edad")
```
---

