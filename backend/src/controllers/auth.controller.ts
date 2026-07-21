import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { loginSchema } from '../validators/auth.validator';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.errors.map(err => err.message);
      return res.status(400).json({
        status: 'fail',
        message: errors.join(', '),
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parseResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process login request',
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch user profile' });
  }
};
