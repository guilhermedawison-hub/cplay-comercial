export const ptBrCrmMessages = {
  ra: {
    auth: {
      sign_in: "Entrar",
      sign_in_error: "Falha na autenticação. Verifique seu e-mail e senha.",
      email: "E-mail",
      password: "Senha",
      username: "Usuário",
      auth_check_error: "Sua sessão expirou. Entre novamente.",
    },
  },
  "ra-supabase": {
    auth: {
      forgot_password: "Esqueceu sua senha?",
      password_reset:
        "Verifique seu e-mail para continuar a redefinição de senha.",
    },
  },
  crm: {
    language: "Idioma",
    auth: {
      first_name: "Nome",
      last_name: "Sobrenome",
      confirm_password: "Confirmar senha",
      confirmation_required:
        "Acesse o link que acabamos de enviar por e-mail para confirmar sua conta.",
      recovery_email_sent:
        "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação em instantes.",
      sign_in_failed: "Não foi possível entrar.",
      sign_in_google_workspace: "Entrar com Google Workspace",
      signup: {
        create_account: "Criar conta",
        create_first_user:
          "Crie a primeira conta de usuário para concluir a configuração.",
        creating: "Criando...",
        initial_user_created: "Usuário inicial criado com sucesso",
      },
      welcome_title: "Bem-vindo ao CPlay Comercial",
    },
  },
  resources: {
    companies: {
      name: "Empresa |||| Empresas",
      forcedCaseName: "Empresa",
      fields: {
        name: "Nome da empresa",
        website: "Site",
        linkedin_url: "LinkedIn",
        phone_number: "Telefone",
        created_at: "Criado em",
        nb_contacts: "Número de contatos",
        revenue: "Faturamento",
        sector: "Segmento",
        size: "Porte",
        tax_identifier: "CNPJ/Identificador fiscal",
        address: "Endereço",
        neighborhood: "Bairro",
        city: "Cidade",
        zipcode: "CEP",
        state_abbr: "Estado",
        country: "País",
        description: "Descrição",
        context_links: "Links de contexto",
        sales_id: "Responsável",
      },
      field_categories: {
        contact: "Contato",
        additional_info: "Informações adicionais",
        address: "Endereço",
        context: "Contexto",
      },
      action: {
        create: "Criar empresa",
        edit: "Editar empresa",
        new: "Nova empresa",
        show: "Ver empresa",
      },
      empty: {
        description: "Nenhuma empresa cadastrada ainda.",
        title: "Nenhuma empresa encontrada",
      },
    },
    contacts: {
      name: "Contato |||| Contatos",
      forcedCaseName: "Contato",
      field_categories: {
        background_info: "Contexto",
        identity: "Identificação",
        misc: "Outros dados",
        personal_info: "Informações de contato",
        position: "Profissional",
      },
      fields: {
        first_name: "Nome",
        last_name: "Sobrenome",
        last_seen: "Última interação",
        title: "Cargo/Função",
        company_id: "Empresa",
        email_jsonb: "E-mails",
        email: "E-mail",
        phone_jsonb: "Telefones",
        phone_number: "WhatsApp/Telefone",
        linkedin_url: "LinkedIn",
        background: "Observações",
        has_newsletter: "Recebe newsletter",
        sales_id: "Responsável",
      },
      action: {
        add: "Adicionar contato",
        add_first: "Adicionar primeiro contato",
        create: "Criar contato",
        edit: "Editar contato",
        export_vcard: "Exportar vCard",
        new: "Novo contato",
        show: "Ver contato",
      },
      empty: {
        description: "Nenhum contato cadastrado ainda.",
        title: "Nenhum contato encontrado",
      },
      filters: {
        managed_by_me: "Gerenciados por mim",
        search: "Buscar nome, empresa...",
        today: "Hoje",
        this_week: "Esta semana",
        tags: "Tags",
        tasks: "Tarefas",
      },
    },
    deals: {
      name: "Oportunidade |||| Oportunidades",
      fields: {
        name: "Oportunidade",
        description: "Observações",
        company_id: "Empresa",
        contact_ids: "Contatos",
        category: "Categoria",
        amount: "Valor",
        expected_closing_date: "Previsão de fechamento",
        stage: "Etapa",
      },
      action: {
        back_to_deal: "Voltar à oportunidade",
        create: "Criar oportunidade",
        new: "Nova oportunidade",
      },
      field_categories: {
        misc: "Comercial",
      },
      filters: {
        only_mine: "Somente minhas oportunidades",
      },
      archived: {
        action: "Arquivar",
        list_title: "Oportunidades arquivadas",
        success: "Oportunidade arquivada",
        title: "Oportunidade arquivada",
        view: "Ver arquivadas",
      },
      inputs: {
        linked_to: "Cliente",
      },
      updated: "Oportunidade atualizada",
      empty: {
        description: "Nenhuma oportunidade cadastrada ainda.",
      },
    },
    sales: {
      name: "Responsável |||| Responsáveis",
      fields: {
        first_name: "Nome",
        last_name: "Sobrenome",
        email: "E-mail",
        administrator: "Administrador",
        disabled: "Desativado",
      },
      action: {
        new: "Novo responsável",
      },
    },
    tasks: {
      name: "Tarefa |||| Tarefas",
    },
    products: {
      name: "Produto/Serviço |||| Produtos/Serviços",
    },
    lead_sources: {
      name: "Origem de Lead |||| Origens de Lead",
    },
  },
};
