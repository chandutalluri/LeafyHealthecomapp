import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { db, users, userSessions, auditLogs } from '../database';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name
    };
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Create session record
    await db.insert(userSessions).values({
      userId: user.id,
      sessionToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Log the login
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'login',
      resource: 'auth',
      details: { email: user.email }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken,
      refreshToken,
      expiresIn: '24h'
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;
    
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      role: role || 'user',
      isActive: true,
      emailVerified: false
    }).returning();

    const payload = { 
      sub: newUser.id, 
      email: newUser.email, 
      role: newUser.role,
      name: newUser.name
    };
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Create session record
    await db.insert(userSessions).values({
      userId: newUser.id,
      sessionToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Log the registration
    await db.insert(auditLogs).values({
      userId: newUser.id,
      action: 'register',
      resource: 'auth',
      details: { email: newUser.email }
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      accessToken,
      refreshToken,
      expiresIn: '24h'
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = { 
        sub: payload.sub, 
        email: payload.email, 
        role: payload.role,
        name: payload.name
      };
      
      const accessToken = this.jwtService.sign(newPayload);
      
      return {
        accessToken,
        expiresIn: '24h'
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(payload: any) {
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub));
    if (!user || !user.isActive) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
}