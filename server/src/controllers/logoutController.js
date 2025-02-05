const logout = (req, res) => {
  try {
      req.logout((err) => {
          if (err) {
              return res.status(500).json({ message: "Failed to logout" });
          }
          res.status(200).json({ message: "Logged out successfully" });
      });
  } catch (error) {
      res.status(500).json({ message: "Error during logout" });
  }
};

module.exports = { logout };
