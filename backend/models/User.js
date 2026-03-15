import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false // Excludes from default queries for security
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "student"],
        message: "{VALUE} is not a valid role"
      },
      default: "student"
    },
    activeSessionId: {
      type: String,
      default: null
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// --- MIDDLEWARE: Password Hashing ---
userSchema.pre("save", async function () {
  // If password isn't modified, just exit the function
  if (!this.isModified("password")) {
    return; 
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // In async middleware, you don't need next() if you don't use it in the params
  } catch (error) {
    throw error; // Mongoose will catch this and pass it to the error handler
  }
});

// --- METHOD: Compare Password ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;