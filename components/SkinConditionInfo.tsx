"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SkinConditionInfoProps {
  conditionName: string
}

export default function SkinConditionInfo({ conditionName }: SkinConditionInfoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="sr-only">Learn more about {conditionName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-primary-800">{conditionName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium text-primary-700 mb-1">What is {conditionName}?</h4>
            <p className="text-sm text-secondary-700">{getConditionDescription(conditionName)}</p>
          </div>

          <div>
            <h4 className="font-medium text-primary-700 mb-1">Common Causes</h4>
            <ul className="text-sm text-secondary-700 list-disc list-inside space-y-1">
              {getConditionCauses(conditionName).map((cause, index) => (
                <li key={index}>{cause}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-primary-700 mb-1">Treatment Options</h4>
            <ul className="text-sm text-secondary-700 list-disc list-inside space-y-1">
              {getConditionTreatments(conditionName).map((treatment, index) => (
                <li key={index}>{treatment}</li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-50 p-3 rounded-md border border-primary-100">
            <p className="text-xs text-secondary-600">
              <strong>Note:</strong> This information is for educational purposes only and is not intended to be a
              substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getConditionDescription(condition: string): string {
  const descriptions: Record<string, string> = {
    Acne: "Acne is a skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It causes whiteheads, blackheads, or pimples. Acne is most common among teenagers, but it affects people of all ages.",
    Dryness:
      "Dry skin is a condition caused by a lack of moisture in the skin. It can make the skin feel tight, rough, and may cause flaking, scaling, or cracking. Dry skin can affect any part of the body but is most common on the hands, arms, and legs.",
    Oiliness:
      "Oily skin is characterized by excess sebum production from the sebaceous glands. This can lead to a shiny appearance, enlarged pores, and an increased tendency to develop acne and other skin problems.",
    Wrinkles:
      "Wrinkles are creases, folds, or ridges in the skin that typically appear as people get older. They are caused by a combination of factors including aging, sun exposure, smoking, and repeated facial expressions.",
    Pigmentation:
      "Pigmentation refers to the coloring of the skin. Hyperpigmentation is a condition where patches of skin become darker than the surrounding skin due to excess melanin production. This can be caused by sun damage, inflammation, or hormonal changes.",
    Rosacea:
      "Rosacea is a chronic inflammatory skin condition that primarily affects the face. It causes redness, visible blood vessels, and sometimes small, red, pus-filled bumps. It may also cause eye problems such as dryness, irritation, or swollen eyelids.",
    Eczema:
      "Eczema, also known as atopic dermatitis, is a chronic skin condition characterized by itchy, inflamed skin. It typically appears as dry, red, irritated, and itchy patches on the skin and is often found on the hands, feet, face, and behind the knees.",
    Psoriasis:
      "Psoriasis is a chronic autoimmune condition that causes rapid buildup of skin cells, resulting in scaling on the skin's surface. It appears as raised, red patches covered with silvery scales, typically on the elbows, knees, scalp, and lower back.",
    Melasma:
      "Melasma is a common skin condition that causes brown or grayish-brown patches, usually on the face. It's more common in women, especially during pregnancy, and is often triggered by hormonal changes and sun exposure.",
    Sensitivity:
      "Sensitive skin is skin that is easily irritated by environmental factors, skincare products, or other triggers. It may appear red, dry, or bumpy, and may feel itchy, burning, or tight. People with sensitive skin often experience adverse reactions to common skincare ingredients.",
  }

  return (
    descriptions[condition] ||
    "This skin condition affects the appearance and health of your skin. It may cause discomfort or cosmetic concerns and can be managed with proper skincare and treatment."
  )
}

function getConditionCauses(condition: string): string[] {
  const causes: Record<string, string[]> = {
    Acne: [
      "Excess oil (sebum) production",
      "Hair follicles clogged by oil and dead skin cells",
      "Bacteria",
      "Hormonal changes",
      "Diet (high-glycemic foods)",
      "Stress",
    ],
    Dryness: [
      "Weather conditions (cold, low humidity)",
      "Hot baths and showers",
      "Harsh soaps and detergents",
      "Aging",
      "Certain medical conditions",
      "Dehydration",
    ],
    Oiliness: [
      "Genetics",
      "Hormonal changes",
      "Humid or hot weather",
      "Overuse of skincare products",
      "Diet high in refined carbohydrates",
      "Stress",
    ],
    Wrinkles: ["Aging", "Sun exposure", "Smoking", "Repeated facial expressions", "Poor nutrition", "Dehydration"],
    Pigmentation: [
      "Sun exposure",
      "Hormonal changes",
      "Inflammation or skin injuries",
      "Certain medications",
      "Aging",
      "Genetic factors",
    ],
    Rosacea: [
      "Genetic factors",
      "Blood vessel abnormalities",
      "Microscopic skin mites (Demodex)",
      "Helicobacter pylori bacteria",
      "Environmental factors",
      "Spicy foods, alcohol, and hot beverages",
    ],
    Eczema: [
      "Genetic factors",
      "Immune system dysfunction",
      "Environmental triggers",
      "Irritants (soaps, detergents)",
      "Allergens (pollen, pet dander)",
      "Stress",
    ],
    Psoriasis: [
      "Immune system dysfunction",
      "Genetic factors",
      "Infections (strep throat)",
      "Stress",
      "Injuries to the skin",
      "Certain medications",
    ],
    Melasma: [
      "Hormonal changes (pregnancy, birth control)",
      "Sun exposure",
      "Genetic factors",
      "Certain medications",
      "Thyroid disorders",
      "Cosmetics",
    ],
    Sensitivity: [
      "Genetic factors",
      "Environmental factors",
      "Skin disorders (eczema, rosacea)",
      "Allergies",
      "Excessive exfoliation",
      "Damaged skin barrier",
    ],
  }

  return (
    causes[condition] || [
      "Genetic factors",
      "Environmental factors",
      "Lifestyle choices",
      "Underlying health conditions",
      "Skincare product usage",
    ]
  )
}

function getConditionTreatments(condition: string): string[] {
  const treatments: Record<string, string[]> = {
    Acne: [
      "Topical retinoids",
      "Benzoyl peroxide",
      "Salicylic acid",
      "Antibiotics",
      "Gentle cleansing routine",
      "Oil-free, non-comedogenic products",
    ],
    Dryness: [
      "Moisturizers with ceramides or hyaluronic acid",
      "Gentle, fragrance-free cleansers",
      "Shorter, cooler showers",
      "Humidifiers",
      "Drinking plenty of water",
      "Avoiding harsh soaps and detergents",
    ],
    Oiliness: [
      "Oil-free, non-comedogenic products",
      "Gentle cleansers with salicylic acid",
      "Clay masks",
      "Blotting papers",
      "Avoiding heavy, occlusive moisturizers",
      "Niacinamide serums",
    ],
    Wrinkles: [
      "Sunscreen (SPF 30+)",
      "Retinoids",
      "Antioxidant serums (vitamin C)",
      "Moisturizers with peptides",
      "Avoiding smoking",
      "Maintaining proper hydration",
    ],
    Pigmentation: [
      "Sunscreen (SPF 30+)",
      "Vitamin C serums",
      "Alpha hydroxy acids (AHAs)",
      "Hydroquinone (under medical supervision)",
      "Retinoids",
      "Avoiding sun exposure",
    ],
    Rosacea: [
      "Gentle skincare routine",
      "Avoiding triggers (spicy food, alcohol)",
      "Sunscreen (mineral-based)",
      "Prescription medications (metronidazole, azelaic acid)",
      "Laser therapy",
      "Anti-inflammatory skincare",
    ],
    Eczema: [
      "Moisturizers (ceramide-rich)",
      "Topical corticosteroids",
      "Avoiding triggers",
      "Gentle, fragrance-free products",
      "Cool, short showers",
      "Humidifiers",
    ],
    Psoriasis: [
      "Topical corticosteroids",
      "Vitamin D analogues",
      "Retinoids",
      "Light therapy",
      "Biologics (for severe cases)",
      "Moisturizers",
    ],
    Melasma: [
      "Sunscreen (SPF 30+)",
      "Hydroquinone (under medical supervision)",
      "Tranexamic acid",
      "Chemical peels",
      "Avoiding sun exposure",
      "Vitamin C serums",
    ],
    Sensitivity: [
      "Gentle, fragrance-free products",
      "Patch testing new products",
      "Minimal ingredient formulations",
      "Avoiding known irritants",
      "Strengthening skin barrier",
      "Consulting with a dermatologist",
    ],
  }

  return (
    treatments[condition] || [
      "Consistent skincare routine",
      "Appropriate products for your skin type",
      "Protecting skin from environmental damage",
      "Healthy lifestyle choices",
      "Consulting with a dermatologist",
    ]
  )
}

