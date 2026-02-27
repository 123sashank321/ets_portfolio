---
sidebar_position: 2
title: Propulsion Physics
description: Rocket and jet propulsion equations with KaTeX math rendering.
---

# Propulsion Physics

This page demonstrates **KaTeX math rendering** for documenting propulsion equations used in the ETS project.

---

## Tsiolkovsky Rocket Equation

The ideal rocket equation governs the motion of vehicles that expel mass at high velocity:

$$
\Delta v = v_e \ln \left( \frac{m_0}{m_f} \right)
$$

Where:
| Symbol | Meaning |
|--------|---------|
| $\Delta v$ | Change in velocity (m/s) |
| $v_e$ | Effective exhaust velocity (m/s) |
| $m_0$ | Initial total mass (kg) |
| $m_f$ | Final mass after propellant consumption (kg) |

---

## Specific Impulse

Specific impulse $I_{sp}$ is the "fuel efficiency" metric for rocket engines:

$$
I_{sp} = \frac{F}{\dot{m} \, g_0} = \frac{v_e}{g_0}
$$

$$
F = \dot{m} \, v_e + (p_e - p_a) A_e
$$

Where $p_e$ is nozzle exit pressure, $p_a$ is ambient pressure, and $A_e$ is exit area.

---

## Thrust-to-Weight Ratio

For an aircraft or rocket to accelerate upward, the thrust-to-weight ratio must exceed unity:

$$
\text{TWR} = \frac{F_{thrust}}{m \, g_0} > 1
$$

---

## Breguet Range Equation (Fixed Wing)

Range of a propeller-driven fixed-wing aircraft:

$$
R = \frac{\eta_p}{c_p} \cdot \frac{L}{D} \cdot \ln \left( \frac{W_0}{W_1} \right)
$$

Where $\eta_p$ is propeller efficiency, $c_p$ is specific fuel consumption, $L/D$ is the lift-to-drag ratio.

---

## Nozzle Flow – Mach Number Relation

For isentropic flow through a converging-diverging nozzle:

$$
\frac{A}{A^*} = \frac{1}{M} \left[ \frac{2}{\gamma+1} \left(1 + \frac{\gamma-1}{2} M^2 \right) \right]^{\frac{\gamma+1}{2(\gamma-1)}}
$$

---

:::tip KaTeX Inline Math
Inline equations work too — e.g., kinetic energy $E_k = \frac{1}{2}mv^2$, or dynamic pressure $q = \frac{1}{2}\rho V^2$.
:::
