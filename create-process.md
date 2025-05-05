## Como criar um Process

### Endpoint

```
POST /api/v1/process-builder
```

### Exemplo de Payload

```json
{
  "name": "Nome do Processo",
  "description": "Descrição do processo",
  "flow": {
    "name": "Nome do Fluxo",
    "description": "Descrição do fluxo",
    "nodes": [
      {
        "name": "Nome do Node",
        "description": "Descrição do node",
        "positionX": 0,
        "positionY": 0,
        "type": "startNode",
        "settings": {}
      }
      // ... outros nodes
    ]
  },
  "form": {
    "name": "Nome do Formulário",
    "metadata": {}
  },
  "rules": [
    {
      "action": "ação da regra",
      "metadata": {}
    }
    // ... outras regras (opcional)
  ]
}
```

### Campos obrigatórios

#### Raiz
- `name` (string, obrigatório): Nome do processo.
- `description` (string, obrigatório): Descrição do processo.

#### flow (objeto, obrigatório)
- `name` (string, obrigatório): Nome do fluxo.
- `description` (string, obrigatório): Descrição do fluxo.
- `nodes` (array de objetos, obrigatório): Lista de nodes do fluxo. Pode ser vazio, mas se houver nodes, todos os campos abaixo são obrigatórios.

##### Cada node em `nodes`:
- `name` (string, obrigatório): Nome do node.
- `description` (string, obrigatório): Descrição do node (pode ser string vazia).
- `positionX` (number, obrigatório): Posição X do node.
- `positionY` (number, obrigatório): Posição Y do node.
- `type` (string, obrigatório): Tipo do node. Valores aceitos: `"startNode"`, `"endNode"`, `"activityNode"`.
- `settings` (objeto, obrigatório): Configurações do node (pode ser `{}`).

#### form (objeto, obrigatório)
- `name` (string, obrigatório): Nome do formulário.
- `metadata` (objeto, obrigatório): Metadados do formulário (pode ser `{}`).

#### rules (array de objetos, opcional)
- Cada regra pode conter:
  - `action` (string, obrigatório): Ação da regra.
  - `metadata` (objeto, obrigatório): Metadados da regra (pode ser `{}`).

### Observações

- Todos os campos obrigatórios devem ser enviados, mesmo que vazios (ex: `description: ""`, `settings: {}` ).
- Não envie campos não previstos no schema, como `description` dentro de `form`.
- O array `nodes` pode ser vazio, mas se houver elementos, todos os campos de cada node são obrigatórios.
