# Taller Kubernetes — 27/08/2026

Notas propias sobre los 3 archivos de este ejercicio: qué hace cada uno,
por qué existe y cómo se conectan entre sí.

## Estructura de la carpeta

```
2026-08-27/
├── 01-pod-ejemplo.yaml     # Pod suelto, sin gestión automática
├── 02-service.yaml         # Punto de red estable
├── 03-deployment.yaml      # Gestión real (réplicas + auto-sanación)
└── resultado-consola.png   # Evidencia de kubectl get all
```

## 1. `01-pod-ejemplo.yaml` — el problema

Un **Pod** es la unidad más pequeña que ejecuta Kubernetes: uno o más
contenedores que comparten red y almacenamiento. Aquí levantamos un
Pod "a mano" (sin Deployment) a propósito, para ver su limitación.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-ejemplo
  labels:
    app: nginx-demo
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
```

**Qué hace:** crea un único contenedor `nginx` y le pone la etiqueta
`app: nginx-demo`. Esa etiqueta es la pieza clave — no el nombre del
Pod — porque es lo que el Service va a usar para encontrarlo.

**El problema que demuestra:** si el Pod muere y se vuelve a crear,
cambia de dirección IP interna (lo comprobamos: `10.244.0.3` →
`10.244.0.4` al borrarlo y recrearlo). Si algo dependiera de esa IP
fija, se rompería. Además, si el Pod muere, **nadie lo revive**: no
hay nada que lo esté vigilando.

## 2. `02-service.yaml` — la solución al problema de red

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: NodePort
  selector:
    app: nginx-demo
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
```

**Qué hace:** crea un punto de acceso estable (`nginx-service`) que
no apunta a una IP fija, sino que busca constantemente **cualquier
Pod que tenga la etiqueta `app: nginx-demo`** (el `selector`). Así,
sin importar cuántas veces cambie la IP del Pod por detrás, el
Service siempre lo encuentra.

- `type: NodePort` expone el servicio en un puerto fijo del nodo
  (`30080`) para poder probarlo desde el navegador con
  `minikube service nginx-service --url`.
- `port` es el puerto del Service; `targetPort` es el puerto real
  del contenedor (ambos 80 aquí porque nginx escucha en el 80).

**Por qué no basta con esto solo:** el Service resuelve el problema
de la red, pero no el de la resiliencia — si el único Pod muere,
sigue sin haber nadie que lo revive. Para eso está el tercer archivo.

## 3. `03-deployment.yaml` — la gestión real

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-demo
  template:
    metadata:
      labels:
        app: nginx-demo
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
```

**Qué hace:** un Deployment no reemplaza al Service — reemplaza al
Pod manual. Le dice a Kubernetes "mantén siempre 2 réplicas de este
contenedor corriendo". Internamente crea un ReplicaSet que vigila
constantemente cuántos Pods con esa `label` existen; si borras uno,
el ReplicaSet crea otro de inmediato (comprobado: al borrar
`nginx-deployment-...-m9db4`, apareció `...-dkppc` solo, sin
intervención manual).

**Por qué usa la misma label (`app: nginx-demo`) que el Pod
manual:** porque así el Service (`02-service.yaml`), que ya estaba
apuntando a esa etiqueta, sigue funcionando sin ningún cambio ni
reinicio — encuentra automáticamente los nuevos Pods creados por el
Deployment. Esa es la pieza que conecta los 3 archivos entre sí.

## El flujo completo, en una frase

`Pod` (unidad básica, frágil) → `Service` (acceso estable por
etiqueta, no por IP) → `Deployment` (gestiona cuántos Pods con esa
etiqueta deben existir siempre, y los revive si mueren). El Service
no sabe ni le importa si detrás hay un Pod suelto o un Deployment
con 10 réplicas — solo le importa la etiqueta.

## Comandos usados (referencia rápida)

```bash
kubectl apply -f 01-pod-ejemplo.yaml
kubectl get pods -o wide              # ver estado e IP
kubectl delete pod nginx-ejemplo      # comprobar que la IP cambia al recrear
kubectl apply -f 02-service.yaml
kubectl get services
minikube service nginx-service --url  # probar en el navegador
kubectl delete pod nginx-ejemplo      # quitar el pod manual
kubectl apply -f 03-deployment.yaml
kubectl get deployments
kubectl get pods -o wide              # ahora hay 2 réplicas
kubectl delete pod <nombre-de-una>    # comprobar auto-sanación
kubectl get all                       # captura para evidencia
```