import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({
        query: `
          query {
            matchedUser(username: "harshkh08") {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
              }
              userCalendar(year: 2026) {
                streak
                totalActiveDays
                submissionCalendar
              }
            }
            userContestRanking(username: "harshkh08") {
              rating
              globalRanking
            }
          }
        `
      }),
      cache: 'no-store'
    })

    if (!res.ok) {
      return NextResponse.json({ error: `LeetCode returned ${res.status}` }, { status: 500 })
    }

    const data = await res.json()

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0].message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
