import axiosClient from "../axiosClient";
class APIClient {
  async signUp(name, email, password) {
    const payload = { name, email, password };
    try {
      const response = await axiosClient.post("/api/auth/signup", payload);
      if (response.status === 201) {
        return { success: true, token: response.data.token };
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      return {
        success: false,
        message: error.response?.data?.msg || "Sign-up failed.",
      };
    }
  }

  async signIn(email, password) {
    const payload = { email, password };
    try {
      const response = await axiosClient.post("/api/auth/signin", { payload });
      if (response.status === 200) {
        return { success: true, token: response.data.token };
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      return {
        success: false,
        message: error.response?.data?.msg || "Sign-in failed.",
      };
    }
  }

  // Method to set token in localStorage
  saveToken(token) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  // Create a new spreadsheet
  async createSpreadsheet(name) {
    try {
      const response = await axiosClient.post("/api/spreadsheets", { name });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error creating spreadsheet:", error);
      return { success: false, message: "Failed to create spreadsheet." };
    }
  }

  // Fetch all spreadsheets
  async fetchSpreadsheets() {
    try {
      const response = await axiosClient.get("/api/spreadsheets");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching spreadsheets:", error);
      return { success: false, message: "Failed to fetch spreadsheets." };
    }
  }

  // Fetch a specific spreadsheet by ID
  async fetchSpreadsheet(id) {
    try {
      const response = await axiosClient.get(`/api/spreadsheets/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching spreadsheet:", error);
      return { success: false, message: "Failed to fetch spreadsheet." };
    }
  }
  // Save changes to a spreadsheet (update a cell)
  async saveSpreadsheetChanges(id, changes) {
    try {
      const response = await axiosClient.patch(`/api/spreadsheets/${id}/cell`, {
        changes,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error saving spreadsheet changes:", error);
      return { success: false, message: "Failed to save changes." };
    }
  }

  // Import data (CSV, JSON, etc.) into a spreadsheet
  async importData(id, formData) {
    try {
      const response = await axiosClient.post(
        `/api/spreadsheets/${id}/ingest`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error importing data:", error);
      return { success: false, message: "Failed to import data." };
    }
  }

  // Delete a spreadsheet
  async deleteSpreadsheet(id) {
    try {
      const response = await axiosClient.delete(`/api/spreadsheets/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error deleting spreadsheet:", error);
      return { success: false, message: "Failed to delete spreadsheet." };
    }
  }

  // Manage collaborators (add)
  async addCollaborator(id, email, role) {
    try {
      const response = await axiosClient.post(
        `/api/spreadsheets/${id}/collaborators`,
        { email, role }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error adding collaborator:", error);
      return { success: false, message: "Failed to add collaborator." };
    }
  }

  // Manage collaborators (remove)
  async removeCollaborator(id, email) {
    try {
      const response = await axiosClient.delete(
        `/api/spreadsheets/${id}/collaborators`,
        { data: { email } }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error removing collaborator:", error);
      return { success: false, message: "Failed to remove collaborator." };
    }
  }
}

const apiClient = new APIClient();
export default apiClient;
