export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      career_select: {
        Row: {
          career_vision: string | null
          certification_descriptions: string[] | null
          certifications: string[] | null
          company_selection_criteria: string[] | null
          company_selection_criteria_descriptions: string[] | null
          experience_descriptions: string[] | null
          experiences: string[] | null
          id: string
          intern_experience_descriptions: string[] | null
          intern_experiences: string[] | null
          product_descriptions: string[] | null
          products: string[] | null
          research: string | null
          self_promotion: string | null
          skill_descriptions: string[] | null
          skills: string[] | null
        }
        Insert: {
          career_vision?: string | null
          certification_descriptions?: string[] | null
          certifications?: string[] | null
          company_selection_criteria?: string[] | null
          company_selection_criteria_descriptions?: string[] | null
          experience_descriptions?: string[] | null
          experiences?: string[] | null
          id: string
          intern_experience_descriptions?: string[] | null
          intern_experiences?: string[] | null
          product_descriptions?: string[] | null
          products?: string[] | null
          research?: string | null
          self_promotion?: string | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
        }
        Update: {
          career_vision?: string | null
          certification_descriptions?: string[] | null
          certifications?: string[] | null
          company_selection_criteria?: string[] | null
          company_selection_criteria_descriptions?: string[] | null
          experience_descriptions?: string[] | null
          experiences?: string[] | null
          id?: string
          intern_experience_descriptions?: string[] | null
          intern_experiences?: string[] | null
          product_descriptions?: string[] | null
          products?: string[] | null
          research?: string | null
          self_promotion?: string | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
        }
        Relationships: []
      }
      levtech_rookie: {
        Row: {
          career_aspiration: string[] | null
          certifications: string[] | null
          desired_job_type: string[] | null
          hackathon_experience_descriptions: string[] | null
          hackathon_experiences: string[] | null
          id: string
          interested_business_types: string[] | null
          interested_industries: string[] | null
          interested_tasks: string[] | null
          intern_experience_descriptions: string[] | null
          intern_experiences: string[] | null
          job_requirements: string[] | null
          language_levels: string[] | null
          languages: string[] | null
          organization: string | null
          other: string | null
          portfolio: string | null
          portfolio_description: string | null
          preferred_company_size: string[] | null
          preferred_work_location: string[] | null
          research: string | null
          skill_descriptions: string[] | null
          skills: string[] | null
        }
        Insert: {
          career_aspiration?: string[] | null
          certifications?: string[] | null
          desired_job_type?: string[] | null
          hackathon_experience_descriptions?: string[] | null
          hackathon_experiences?: string[] | null
          id: string
          interested_business_types?: string[] | null
          interested_industries?: string[] | null
          interested_tasks?: string[] | null
          intern_experience_descriptions?: string[] | null
          intern_experiences?: string[] | null
          job_requirements?: string[] | null
          language_levels?: string[] | null
          languages?: string[] | null
          organization?: string | null
          other?: string | null
          portfolio?: string | null
          portfolio_description?: string | null
          preferred_company_size?: string[] | null
          preferred_work_location?: string[] | null
          research?: string | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
        }
        Update: {
          career_aspiration?: string[] | null
          certifications?: string[] | null
          desired_job_type?: string[] | null
          hackathon_experience_descriptions?: string[] | null
          hackathon_experiences?: string[] | null
          id?: string
          interested_business_types?: string[] | null
          interested_industries?: string[] | null
          interested_tasks?: string[] | null
          intern_experience_descriptions?: string[] | null
          intern_experiences?: string[] | null
          job_requirements?: string[] | null
          language_levels?: string[] | null
          languages?: string[] | null
          organization?: string | null
          other?: string | null
          portfolio?: string | null
          portfolio_description?: string | null
          preferred_company_size?: string[] | null
          preferred_work_location?: string[] | null
          research?: string | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          field_name: string | null
          id: string
          target_table: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          field_name?: string | null
          id: string
          target_table?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          field_name?: string | null
          id?: string
          target_table?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mynavi: {
        Row: {
          future_plan: string | null
          id: string
          self_promotion: string | null
        }
        Insert: {
          future_plan?: string | null
          id: string
          self_promotion?: string | null
        }
        Update: {
          future_plan?: string | null
          id?: string
          self_promotion?: string | null
        }
        Relationships: []
      }
      one_career: {
        Row: {
          engineer_aspiration: string | null
          id: string
          intern_experience_descriptions: string[] | null
          intern_experiences: string[] | null
          product_descriptions: string[] | null
          products: string[] | null
          research_descriptions: string[] | null
          researches: string[] | null
          skill_descriptions: string[] | null
          skills: string[] | null
        }
        Insert: {
          engineer_aspiration?: string | null
          id: string
          intern_experience_descriptions?: string[] | null
          intern_experiences?: string[] | null
          product_descriptions?: string[] | null
          products?: string[] | null
          research_descriptions?: string[] | null
          researches?: string[] | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
        }
        Update: {
          engineer_aspiration?: string | null
          id?: string
          intern_experience_descriptions?: string[] | null
          intern_experiences?: string[] | null
          product_descriptions?: string[] | null
          products?: string[] | null
          research_descriptions?: string[] | null
          researches?: string[] | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          career_vision: string | null
          certification_descriptions: string[] | null
          certifications: string[] | null
          company_selection_criteria: string | null
          desired_job_type: string | null
          engineer_aspiration: string | null
          id: string
          intern_descriptions: string[] | null
          interns: string[] | null
          organization: string | null
          product_descriptions: string[] | null
          products: string[] | null
          research: string | null
          self_promotion: string | null
          skill_descriptions: string[] | null
          skills: string[] | null
          student_experience: string | null
        }
        Insert: {
          career_vision?: string | null
          certification_descriptions?: string[] | null
          certifications?: string[] | null
          company_selection_criteria?: string | null
          desired_job_type?: string | null
          engineer_aspiration?: string | null
          id: string
          intern_descriptions?: string[] | null
          interns?: string[] | null
          organization?: string | null
          product_descriptions?: string[] | null
          products?: string[] | null
          research?: string | null
          self_promotion?: string | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
          student_experience?: string | null
        }
        Update: {
          career_vision?: string | null
          certification_descriptions?: string[] | null
          certifications?: string[] | null
          company_selection_criteria?: string | null
          desired_job_type?: string | null
          engineer_aspiration?: string | null
          id?: string
          intern_descriptions?: string[] | null
          interns?: string[] | null
          organization?: string | null
          product_descriptions?: string[] | null
          products?: string[] | null
          research?: string | null
          self_promotion?: string | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
          student_experience?: string | null
        }
        Relationships: []
      }
      sample_users: {
        Row: {
          age: number | null
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          id: number
          is_active: boolean | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      supporterz: {
        Row: {
          career_vision: string | null
          id: string
          intern_experience_descriptions: string[] | null
          intern_experiences: string[] | null
          product_descriptions: string[] | null
          product_tech_stacks: string[] | null
          products: string[] | null
          research_descriptions: string[] | null
          researches: string[] | null
          self_promotion: string | null
          skill_descriptions: string[] | null
          skills: string[] | null
        }
        Insert: {
          career_vision?: string | null
          id: string
          intern_experience_descriptions?: string[] | null
          intern_experiences?: string[] | null
          product_descriptions?: string[] | null
          product_tech_stacks?: string[] | null
          products?: string[] | null
          research_descriptions?: string[] | null
          researches?: string[] | null
          self_promotion?: string | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
        }
        Update: {
          career_vision?: string | null
          id?: string
          intern_experience_descriptions?: string[] | null
          intern_experiences?: string[] | null
          product_descriptions?: string[] | null
          product_tech_stacks?: string[] | null
          products?: string[] | null
          research_descriptions?: string[] | null
          researches?: string[] | null
          self_promotion?: string | null
          skill_descriptions?: string[] | null
          skills?: string[] | null
        }
        Relationships: []
      }
      users: {
        Row: {
          age: number | null
          birth_date: string | null
          category: string | null
          created_at: string | null
          faculty: string | null
          first_name: string
          grade: number | null
          last_name: string
          services: string[] | null
          target_job_type: string
          university: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          birth_date?: string | null
          category?: string | null
          created_at?: string | null
          faculty?: string | null
          first_name: string
          grade?: number | null
          last_name: string
          services?: string[] | null
          target_job_type: string
          university?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          birth_date?: string | null
          category?: string | null
          created_at?: string | null
          faculty?: string | null
          first_name?: string
          grade?: number | null
          last_name?: string
          services?: string[] | null
          target_job_type?: string
          university?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
