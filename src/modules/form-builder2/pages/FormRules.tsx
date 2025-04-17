'use client'

import { ContainerMain } from '@/components/ContainerMain'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { FormBuilderHeader } from '@/components/FormBuilderHeader'
import {
  Select as SelectUI,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormRow } from '@/modules/form-builder2/types'
import { useFormBuilder } from '@/modules/form-builder2/contexts/FormBuilderContext'
import { Select } from '@/components/Select'

interface FormRule {
  id: string
  condition: string
  action: string
  target: string
}

export default function FormRules() {
  const [rules, setRules] = useState<FormRule[]>([])
  const { rows } = useFormBuilder()

  const addRule = () => {
    setRules([
      ...rules,
      {
        id: Math.random().toString(36).substring(7),
        condition: '',
        action: '',
        target: '',
      },
    ])
  }

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const updateRule = (id: string, field: keyof FormRule, value: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)))
  }

  return (
    <ContainerMain
      header={<FormBuilderHeader version={1} isEditable={false} hasBackButton={true} />}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Regras do Formulário</h1>
          <Button
            onClick={addRule}
            className="gap-1 bg-purple-500 hover:bg-purple-600 text-white rounded-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Regra
          </Button>
        </div>

        <Tabs defaultValue="conditions" className="w-full">
          <TabsList>
            <TabsTrigger value="conditions">Condições</TabsTrigger>
            <TabsTrigger value="validations">Validações</TabsTrigger>
          </TabsList>

          <TabsContent value="conditions" className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Regra #{rules.indexOf(rule) + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => removeRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    title="Atividade"
                    options={[{ label: 'Igual a', value: 'equals' }]}
                    defaultOption="Igual a"
                  />
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Atividade</label>
                      <SelectUI
                        value={rule.condition}
                        onValueChange={(value) => updateRule(rule.id, 'condition', value)}
                      >
                        <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <SelectValue placeholder="Selecione uma atividade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Igual a</SelectItem>
                          <SelectItem value="notEquals">Diferente de</SelectItem>
                          <SelectItem value="contains">Contém</SelectItem>
                          <SelectItem value="greaterThan">Maior que</SelectItem>
                          <SelectItem value="lessThan">Menor que</SelectItem>
                        </SelectContent>
                      </SelectUI>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Condição</label>
                      <SelectUI
                        value={rule.condition}
                        onValueChange={(value) => updateRule(rule.id, 'condition', value)}
                      >
                        <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <SelectValue placeholder="Selecione uma condição" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Igual a</SelectItem>
                          <SelectItem value="notEquals">Diferente de</SelectItem>
                          <SelectItem value="contains">Contém</SelectItem>
                          <SelectItem value="greaterThan">Maior que</SelectItem>
                          <SelectItem value="lessThan">Menor que</SelectItem>
                        </SelectContent>
                      </SelectUI>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ação</label>
                      <SelectUI
                        value={rule.action}
                        onValueChange={(value) => updateRule(rule.id, 'action', value)}
                      >
                        <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <SelectValue placeholder="Selecione uma ação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="show">Mostrar</SelectItem>
                          <SelectItem value="hide">Ocultar</SelectItem>
                          <SelectItem value="enable">Habilitar</SelectItem>
                          <SelectItem value="disable">Desabilitar</SelectItem>
                          <SelectItem value="require">Tornar obrigatório</SelectItem>
                        </SelectContent>
                      </SelectUI>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Componente</label>
                      <SelectUI
                        value={rule.target}
                        onValueChange={(value) => updateRule(rule.id, 'target', value)}
                      >
                        <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <SelectValue placeholder="Selecione um componente" />
                        </SelectTrigger>
                        <SelectContent>
                          {rows.map((row) =>
                            row.components
                              .filter(
                                (component): component is NonNullable<typeof component> =>
                                  component !== null,
                              )
                              .map((component) => (
                                <SelectItem key={component.id} value={component.id}>
                                  {component.label || component.name}
                                </SelectItem>
                              )),
                          )}
                        </SelectContent>
                      </SelectUI>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="validations">
            <Card>
              <CardHeader>
                <CardTitle>Validações</CardTitle>
              </CardHeader>
              <CardContent>{/* Conteúdo das validações */}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculations">
            <Card>
              <CardHeader>
                <CardTitle>Cálculos</CardTitle>
              </CardHeader>
              <CardContent>{/* Conteúdo dos cálculos */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContainerMain>
  )
}
